const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');



const WebSocket = require('ws');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'secret',
  database: 'db_for_resume_site',
});

const jwtSecret = 'secret';

db.connect(err => {
  if (err) {
    console.error('Помилка підключення до бази даних:', err);
    return;
  }
  console.log('Успішно підключено до бази даних MySQL');
});


app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Помилка сервера' });
    if (results.length === 0) return res.status(401).json({ message: 'Невірний логін або пароль' });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Помилка сервера' });
      if (!isMatch) return res.status(401).json({ message: 'Невірний логін або пароль' });

      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '5h' });
     
      res.json({ token, username: user.username });
    });
  });
});


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('Немає токена доступу');
    return res.status(401).json({ message: 'Немає токена доступу' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.log('Невірний токен доступу:', err);
      return res.status(403).json({ message: 'Невірний токен доступу' });
    }
    req.user = user;
    next();
  });
}


app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  db.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      res.json(results[0])
      console.log('Користувач запросив доступ до: ${results[0].id}')
    } else {
      res.status(404).send('Product not found');
    }
  });
});

app.use('/images', express.static(path.join(__dirname, 'images')));



app.get('/api/cart', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT products.id, products.name, products.price, products.imageUrl 
     FROM cart_items 
     JOIN products ON cart_items.product_id = products.id 
     WHERE cart_items.user_id = ?`,
    [userId],
    (err, results) => {
      if (err) {
        console.error('Помилка при отриманні товарів з корзини:', err);
        return res.status(500).send(err);
      }
      
      res.json(results);
    }
  );
});


app.post('/api/cart', authenticateToken, (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  console.log(`Запит на додавання товару до корзини:`);
  console.log(`Користувач ID: ${userId}, Товар ID: ${productId}`);

  db.query('INSERT INTO cart_items (user_id, product_id) VALUES (?, ?)', [userId, productId], (err) => {
    if (err) {
      console.error('Помилка при додаванні товару до корзини:', err);
      return res.status(500).send('Помилка при додаванні товару до корзини');
    }
    console.log(`Товар ID ${productId} успішно додано до корзини для користувача ID ${userId}`);
    res.status(200).send('Товар додано до корзини');
  });
});

app.delete('/api/cart', authenticateToken, (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  console.log(`Запит на видалення товару з корзини:`);
  console.log(`Користувач ID: ${userId}, Товар ID: ${productId}`);

  db.query('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId], (err) => {
    if (err) {
      console.error('Помилка при видаленні товару з корзини:', err);
      return res.status(500).send('Помилка при видаленні товару з корзини');
    }
    console.log(`Товар ID ${productId} успішно видалено з корзини для користувача ID ${userId}`);
    res.status(200).send('Товар видалено з корзини');
  });
});



app.get('/api/users', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.query('SELECT id, username FROM users WHERE id != ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results); 
  });
});

app.post('/api/conference', authenticateToken, (req, res) => {
  const userId = req.user.id; 
  const { targetUserId } = req.body; 
  console.log(`прийшло`, targetUserId, userId);



  db.query('SELECT id FROM users WHERE id = ?', [targetUserId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Користувач не знайдений' });
    }

    
    db.query(
      'INSERT INTO conferences (user_1_id, user_2_id) VALUES (?, ?)',
      [userId, targetUserId],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({ message: 'The dialog is created', conferenceId: result.insertId });
      }
    );
  });
});

app.get('/api/conferences', authenticateToken, (req, res) => {
  const userId = req.user.id;

  
  db.query(
    `SELECT 
        conferences.id, 
        IF(conferences.user_1_id = ?, conferences.user_2_id, conferences.user_1_id) AS other_user_id 
      FROM conferences 
      WHERE conferences.user_1_id = ? OR conferences.user_2_id = ?`,
    [userId, userId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      
      const dialogs = results.map(dialog => {
        return {
          id: dialog.id,
          otherUserId: dialog.other_user_id
        };
      });

      res.json(dialogs); 
    }
  );
});


app.get('/api/conferences/check', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const targetUserId = req.query.targetUserId;

  
  db.query(
    `SELECT id FROM conferences 
     WHERE (user_1_id = ? AND user_2_id = ?) 
     OR (user_1_id = ? AND user_2_id = ?)`,
    [userId, targetUserId, targetUserId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      
      if (results.length > 0) {
        return res.json({ exists: true, dialogId: results[0].id });
      } else {
        return res.json({ exists: false });
      }
    }
  );
});


app.get('/api/messages', authenticateToken, (req, res) => {
  const { conferenceId } = req.query;
  const userId = req.user.id;

  db.query(
    `SELECT 
       messages.id, 
       messages.sender_id, 
       messages.receiver_id, 
       messages.message, 
       messages.created_at, 
       IF(messages.sender_id = ?, 'You', users.username) AS sender_type,
       users.username AS other_username
     FROM messages
     JOIN users ON users.id = IF(messages.sender_id = ?, messages.receiver_id, messages.sender_id)
     WHERE messages.conference_id = ?
     ORDER BY messages.created_at ASC`,
    [userId, userId, conferenceId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      console.log(results);

      res.json(results);
    }
  );
});


app.post('/api/messages', authenticateToken, (req, res) => {
  const { conferenceId, message } = req.body;
  const senderId = req.user.id;

 
  db.query(
    'SELECT IF(user_1_id = ?, user_2_id, user_1_id) AS receiver_id FROM conferences WHERE id = ?',
    [senderId, conferenceId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const receiverId = results[0].receiver_id;

      
      db.query(
        'INSERT INTO messages (sender_id, receiver_id, message, conference_id) VALUES (?, ?, ?, ?)',
        [senderId, receiverId, message, conferenceId],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.status(201).json({ message: 'Повідомлення надіслано', messageId: result.insertId });
        }
      );
    }
  );
});


const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('Клієнт підключився.');

  ws.on('message', message => {
    console.log('Повідомлення від клієнта:', message);
  });

  ws.on('close', () => {
    console.log('Клієнт відключився.');
  });
});

const broadcastUpdates = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};


const dbExchange = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'secret',
  database: 'stock_exchange_db',
});

dbExchange.connect(err => {
  if (err) {
    console.error('Помилка підключення до біржової бази даних:', err);
    return;
  }
  console.log('Успішно підключено до біржової бази даних');
});

const updateAllStocks = () => {
  dbExchange.query('SELECT * FROM stocks', (err, stocks) => {
    if (err) {
      console.error('Помилка виконання запиту: ' + err.stack);
      return;
    }

    stocks.forEach(stock => {
      const priceHistory = stock.price_history;
      const currentPrice = parseFloat(stock.price);

      const randomChange = Math.random(); 
      let priceChange;

      if (randomChange < 0.4) { 
        priceChange = -(Math.random() * 3); 
      } else { 
        priceChange = Math.random() * 3; 
      }

      const newPrice = parseFloat((currentPrice + priceChange).toFixed(2));
      const percentageChange = parseFloat(((newPrice - currentPrice) / currentPrice * 100).toFixed(2));

      priceHistory.shift();
      priceHistory.push(newPrice);

      dbExchange.query('UPDATE stocks SET price = ?, price_history = ? WHERE id = ?',
        [newPrice, JSON.stringify(priceHistory), stock.id],
        err => {
          if (err) {
            console.error(`Помилка оновлення даних для акції ${stock.id}:`, err);
          } else {
            console.log(`Акція ${stock.stock_name} оновлена.`);
          }
        }
      );

      broadcastUpdates({
        id: stock.id,
        stockName: stock.stock_name,
        price: newPrice,
        priceHistory: priceHistory,
        percentageChange: percentageChange,
        stockLogo: stock.stock_logo
      });
    });
  });
};
setInterval(updateAllStocks, 5 * 60 * 1000);

wss.on('connection', ws => {
  console.log('Клієнт підключився.');

  dbExchange.query('SELECT * FROM stocks', (err, stocks) => {
    if (err) {
      console.error('Помилка виконання запиту: ' + err.stack);
      return;
    }

    const formattedStocks = stocks.map(stock => ({
      id: stock.id,
      stockName: stock.stock_name,
      price: stock.price,
      priceHistory: stock.price_history,
      percentageChange: parseFloat(((stock.price - stock.price_history.at(-2)) / stock.price_history.at(-2) * 100).toFixed(2)),
      stockLogo: stock.stock_logo
    }));

    ws.send(JSON.stringify({ type: 'initial', stocks: formattedStocks }));
  });

  ws.on('message', message => {
    console.log('Повідомлення від клієнта:', message);
  });

  ws.on('close', () => {
    console.log('Клієнт відключився.');
  });
});

app.get('/api/stocks', (req, res) => {
  dbExchange.query('SELECT * FROM stocks', (err, results) => {
    if (err) {
      console.error('Помилка виконання запиту: ' + err.stack);
      res.status(500).send('Помилка сервера');
      return;
    }

    res.json(results);
  });
});

app.post('/api/exchange', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { stockId, amountInDollars, stockPrice, stockName } = req.body; 

  
  dbExchange.query('SELECT balance FROM exchange_users_balance WHERE user_id = ?', [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ message: 'Server error or user balance not found' });
    }

    const userBalance = results[0].balance;
    if (userBalance < amountInDollars) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    
    const quantity = (amountInDollars / stockPrice).toFixed(5);
    const newBalance = userBalance - amountInDollars;

    
    dbExchange.query('UPDATE exchange_users_balance SET balance = ? WHERE user_id = ?', [newBalance, userId], (err) => {
      if (err) return res.status(500).json({ message: 'Failed to update balance' });

      
      dbExchange.query(
        'INSERT INTO user_transactions (user_id, stock_id, stock_name, quantity, purchase_price, transaction_type) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, stockId, stockName, quantity, stockPrice, 'buy'],
        (err) => {
          if (err) return res.status(500).json({ message: 'Failed to record purchase' });

         
          dbExchange.query(
            'INSERT INTO user_stocks (user_id, stock_id, stock_name, quantity) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
            [userId, stockId, stockName, quantity, quantity],
            (err) => {
              if (err) return res.status(500).json({ message: 'Failed to record purchase in user stocks' });
              res.json({ message: 'Purchase successful' });
            }
          );
        }
      );
    });
  });
});

app.post('/api/sell', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { stockId, stockName, sellQuantity, stockPrice } = req.body;

  
  dbExchange.query(
    `
      SELECT 
        SUM(CASE WHEN transaction_type = 'buy' THEN quantity ELSE 0 END) -
        SUM(CASE WHEN transaction_type = 'sell' THEN quantity ELSE 0 END) AS availableQuantity
      FROM user_transactions
      WHERE user_id = ? AND stock_id = ?
    `,
    [userId, stockId],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(500).json({ message: 'Error calculating available quantity' });
      }

      const availableQuantity = parseFloat(results[0].availableQuantity) || 0;

      
      if (sellQuantity > availableQuantity) {
        return res.status(400).json({ message: 'Not enough shares to sell' });
      }

     
      const sellValue = (sellQuantity * stockPrice).toFixed(2);

      
      dbExchange.query(
        'INSERT INTO user_transactions (user_id, stock_id, stock_name, quantity, purchase_price, transaction_type) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, stockId, stockName, sellQuantity, stockPrice, 'sell'],
        (err) => {
          if (err) {
            return res.status(500).json({ message: 'Failed to record sale transaction' });
          }

          
          dbExchange.query(
            'UPDATE exchange_users_balance SET balance = balance + ? WHERE user_id = ?',
            [sellValue, userId],
            (err) => {
              if (err) {
                return res.status(500).json({ message: 'Failed to update user balance' });
              }

              res.json({ message: 'Sale successful', sellValue });
            }
          );
        }
      );
    }
  );
});


const getCurrentStockPrices = () => {
  return new Promise((resolve, reject) => {
    dbExchange.query('SELECT stock_name, price, stock_logo FROM stocks', (err, results) => {
      if (err) return reject(err);
      const prices = {};
      results.forEach(stock => {
        prices[stock.stock_name] = {
          price: parseFloat(stock.price),
          logo: stock.stock_logo
        };
      });
      resolve(prices);
    });
  });
};

app.get('/api/allInfoAboutUserExchange', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    
    const [balanceResults] = await dbExchange.promise().query(
      'SELECT balance FROM exchange_users_balance WHERE user_id = ?', [userId]
    );

    if (balanceResults.length === 0) {
      return res.status(404).json({ message: 'Balance not found' });
    }

    const userBalance = balanceResults[0].balance;

    
    const [transactionResults] = await dbExchange.promise().query(
      `SELECT transaction_id, user_id, stock_id, stock_name, quantity, purchase_price, transaction_type, transaction_date
       FROM user_transactions
       WHERE user_id = ?`, [userId]
    );

    
    const portfolio = {};

    
    const [userResults] = await db.promise().query(
      'SELECT username FROM users WHERE id = ?', [userId]
    );

    if (userResults.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const stockPrices = await getCurrentStockPrices();

    
    if (transactionResults.length > 0) {
      transactionResults.forEach(transaction => {
        const { stock_id, stock_name, quantity, transaction_type, purchase_price } = transaction;
        const parsedQuantity = parseFloat(quantity);

        
        if (transaction_type === 'buy') {
          if (!portfolio[stock_id]) {
            portfolio[stock_id] = { stockName: stock_name, quantity: 0, totalInvestment: 0 };
          }
          portfolio[stock_id].quantity += parsedQuantity;
          portfolio[stock_id].totalInvestment += parsedQuantity * parseFloat(purchase_price);
        } 
        
        else if (transaction_type === 'sell') {
          if (!portfolio[stock_id]) {
            portfolio[stock_id] = { stockName: stock_name, quantity: 0, totalInvestment: 0 };
          }
          portfolio[stock_id].quantity -= parsedQuantity;
          portfolio[stock_id].totalInvestment -= parsedQuantity * parseFloat(purchase_price);
        }
      });
    }

    
    const userPortfolio = Object.keys(portfolio).map(stockId => {
      const stockInfo = portfolio[stockId];
      const { price, logo } = stockPrices[stockInfo.stockName] || { price: 0, logo: null };

      
      const totalCurrentValue = stockInfo.quantity * price;
      const percentChange = stockInfo.totalInvestment > 0
        ? ((totalCurrentValue - stockInfo.totalInvestment) / stockInfo.totalInvestment) * 100
        : 0;

      return {
        stockId: parseInt(stockId),
        stockName: stockInfo.stockName,
        quantity: stockInfo.quantity,
        totalInvestment: parseFloat(stockInfo.totalInvestment.toFixed(2)),
        currentPrice: price,
        totalCurrentValue: parseFloat(totalCurrentValue.toFixed(2)),
        stockLogo: logo,
        percentChange: percentChange.toFixed(2)
      };
    });

    const responseData = {
      username: userResults[0].username,
      balance: userBalance,
      user_transactions: transactionResults,
      user_portfolio: userPortfolio
    };

    res.json(responseData);
  } catch (err) {
    console.error('Помилка обробки запиту:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/get_user_transactions', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const userTransactionsSQL = 'SELECT * FROM user_transactions WHERE user_id = ?';
    dbExchange.query(userTransactionsSQL, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database query error' });
      }
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const dbTodoList = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'secret',
  database: 'todo_list_db',
});

dbTodoList.connect(err => {
  if (err) {
    console.error('Помилка підключення до біржової бази даних:', err);
    return;
  }
  console.log('Успішно підключено до туду бази даних');
});

app.get('/api/user-affairs', authenticateToken, (req, res) => {
  const userId = req.user.id;

  
  dbTodoList.query(
    'SELECT * FROM affairs WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) {
        console.error('Помилка при отриманні завдань користувача:', err);
        return res.status(500).json({ message: 'Помилка сервера' });
      }

      res.json({
        message: 'Завдання успішно отримано',
        data: results,
      });
    }
  );
});

app.get('/api/user-completed-affairs', authenticateToken, (req, res) => {
  const userId = req.user.id;

 
  dbTodoList.query(
    'SELECT * FROM finish_affairs WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) {
        console.error('Помилка при отриманні завдань користувача:', err);
        return res.status(500).json({ message: 'Помилка сервера' });
      }

      res.json({
        message: 'Завдання успішно отримано',
        data: results,
      });
    }
  );
});


app.post('/api/user-affairs', authenticateToken, (req, res) => {
  const userId = req.user.id; 
  const { affair_name, affair_description, affair_tags, affair_end_date } = req.body;

  if (!affair_name || !affair_description || !affair_tags || !affair_end_date) {
    return res.status(400).json({ message: 'Всі поля обов’язкові для заповнення' });
  }

  const tagsString = JSON.stringify(affair_tags); 
  const formattedDate = new Date(affair_end_date).toISOString().split('T')[0]; 

  const query = `
    INSERT INTO affairs (user_id, affair_name, affair_description, affair_tags, affair_end_date) 
    VALUES (?, ?, ?, ?, ?)
  `;

  dbTodoList.query(
    query,
    [userId, affair_name, affair_description, tagsString, formattedDate],
    (err, result) => {
      if (err) {
        console.error('Помилка додавання завдання:', err);
        return res.status(500).json({ message: 'Не вдалося додати завдання' });
      }
      res.status(201).json({
        message: 'Завдання успішно додано',
        data: {
          id: result.insertId,
          affair_name,
          affair_description,
          affair_tags,
          affair_end_date: formattedDate,
        },
      });
    }
  );
});

app.delete('/api/user-affairs/:id', authenticateToken, (req, res) => {
  const userId = req.user.id; 
  const affairId = req.params.id; 

  const query = 'DELETE FROM affairs WHERE id = ? AND user_id = ?';
  dbTodoList.query(query, [affairId, userId], (err, result) => {
    if (err) {
      console.error('Помилка видалення завдання:', err);
      return res.status(500).json({ message: 'Не вдалося видалити завдання' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Завдання не знайдено або ви не маєте доступу до нього' });
    }

    res.status(200).json({ message: 'Завдання успішно видалено' });
  });
});

app.put('/api/user-affairs/:id', authenticateToken, (req, res) => {
  const userId = req.user.id; 
  const affairId = req.params.id;
  const { affair_name, affair_description, affair_tags, affair_end_date } = req.body;

  
  if (!affair_name || !affair_description || !affair_tags || !affair_end_date) {
    return res.status(400).json({ message: 'Всі поля обов’язкові для заповнення' });
  }

  const tagsString = JSON.stringify(affair_tags); 
  const formattedDate = new Date(affair_end_date).toISOString().split('T')[0]; 

  const query = `
    UPDATE affairs
    SET affair_name = ?, affair_description = ?, affair_tags = ?, affair_end_date = ?
    WHERE id = ? AND user_id = ?
  `;

  dbTodoList.query(
    query,
    [affair_name, affair_description, tagsString, formattedDate, affairId, userId],
    (err, result) => {
      if (err) {
        console.error('Помилка оновлення завдання:', err);
        return res.status(500).json({ message: 'Не вдалося оновити завдання' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Завдання не знайдено або ви не маєте доступу до нього' });
      }

      res.status(200).json({
        message: 'Завдання успішно оновлено',
        data: {
          id: affairId,
          affair_name,
          affair_description,
          affair_tags,
          affair_end_date: formattedDate,
        },
      });
    }
  );
});

app.get('/api/user-week-affairs', authenticateToken, (req, res) => {
  const userId = req.user.id;

  
  const query = 'SELECT * FROM week_affairs WHERE user_id = ?';
  
  
  dbTodoList.query(query, [userId], (error, weekAffairsResults) => {
    if (error) {
      
      return res.status(500).json({ error: 'Database error' });
    }

    
    const taskIds = weekAffairsResults.reduce((ids, week) => {
      
      return ids.concat(
        week.week_monday,
        week.week_tuesday,
        week.week_wednesday,
        week.week_thursday,
        week.week_friday,
        week.week_saturday,
        week.week_sunday
      );
    }, []);

    
    const uniqueTaskIds = [...new Set(taskIds)];

    
    if (uniqueTaskIds.length > 0) {
      const affairsQuery = 'SELECT * FROM affairs WHERE id IN (?)';
      
      dbTodoList.query(affairsQuery, [uniqueTaskIds], (affairsError, affairsResults) => {
        if (affairsError) {
          return res.status(500).json({ error: 'Error fetching affairs' });
        }

        
        const affairsMap = affairsResults.reduce((map, affair) => {
          map[affair.id] = affair;  
          return map;
        }, {});

        
        const transformedWeeks = weekAffairsResults.map(week => {
          return {
            ...week,
            week_monday: week.week_monday.map(id => affairsMap[id] || { message: 'No task' }),
            week_tuesday: week.week_tuesday.map(id => affairsMap[id] || { message: 'No task' }),
            week_wednesday: week.week_wednesday.map(id => affairsMap[id] || { message: 'No task' }),
            week_thursday: week.week_thursday.map(id => affairsMap[id] || { message: 'No task' }),
            week_friday: week.week_friday.map(id => affairsMap[id] || { message: 'No task' }),
            week_saturday: week.week_saturday.map(id => affairsMap[id] || { message: 'No task' }),
            week_sunday: week.week_sunday.map(id => affairsMap[id] || { message: 'No task' }),
          };
        });

        
        res.json(transformedWeeks);
      });
    } else {
      
      res.json(weekAffairsResults);
    }
  });
});

app.post('/api/user-finish-affairs', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { affair_id, affair_name, affair_end_date, affair_description, affair_tags } = req.body;

  if (!affair_id) {
    return res.status(400).json({ error: 'Невірні дані' });
  }

  
  const formattedAffairEndDate = new Date(affair_end_date).toISOString().split('T')[0];

  const tagsString = JSON.stringify(affair_tags);

  dbTodoList.beginTransaction(err => {
    if (err) {
      console.error('Помилка транзакції:', err);
      return res.status(500).json({ error: 'Помилка сервера' });
    }

    
    dbTodoList.query(
      `INSERT INTO finish_affairs (user_id, affair_id, affair_name, affair_end_date, affair_description, affair_tags, affair_finish_date)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [userId, affair_id, affair_name, formattedAffairEndDate, affair_description, tagsString],
      (insertErr) => {
        if (insertErr) {
          return dbTodoList.rollback(() => {
            console.error('Помилка додавання у finish_affairs:', insertErr);
            res.status(500).json({ error: 'Помилка сервера' });
          });
        }

        
        dbTodoList.query(
          `DELETE FROM affairs WHERE id = ? AND user_id = ?`,
          [affair_id, userId],
          (deleteErr, result) => {
            if (deleteErr) {
              return dbTodoList.rollback(() => {
                console.error('Помилка видалення з affairs:', deleteErr);
                res.status(500).json({ error: 'Помилка сервера' });
              });
            }

            if (result.affectedRows === 0) {
              return dbTodoList.rollback(() => {
                res.status(404).json({ error: 'Завдання не знайдено або вже видалено' });
              });
            }

            
            dbTodoList.commit(commitErr => {
              if (commitErr) {
                return dbTodoList.rollback(() => {
                  console.error('Помилка під час commit:', commitErr);
                  res.status(500).json({ error: 'Помилка сервера' });
                });
              }

              res.json({ success: true, message: 'Завдання завершено' });
            });
          }
        );
      }
    );
  });
});

app.post('/api/user-week-affairs', authenticateToken, (req, res) => {
  const userId = req.user.id; 
  const { week_affairs_name, week_monday, week_tuesday, week_wednesday, week_thursday, week_friday, week_saturday, week_sunday } = req.body;

  
  if (!week_affairs_name || !Array.isArray(week_monday) || !Array.isArray(week_tuesday) || !Array.isArray(week_wednesday) || !Array.isArray(week_thursday) || !Array.isArray(week_friday) || !Array.isArray(week_saturday) || !Array.isArray(week_sunday)) {
    return res.status(400).json({ message: 'All fields are required and should be in proper format' });
  }

  
  const query = `
    INSERT INTO week_affairs (user_id, week_affairs_name, week_monday, week_tuesday, week_wednesday, week_thursday, week_friday, week_saturday, week_sunday)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  
  dbTodoList.query(query, [
    userId,
    week_affairs_name,
    JSON.stringify(week_monday),
    JSON.stringify(week_tuesday),
    JSON.stringify(week_wednesday),
    JSON.stringify(week_thursday),
    JSON.stringify(week_friday),
    JSON.stringify(week_saturday),
    JSON.stringify(week_sunday)
  ], (err, result) => {
    if (err) {
      console.error('Error inserting week affairs:', err);
      return res.status(500).json({ message: 'Failed to add week affairs' });
    }

    
    res.status(201).json({
      message: 'Week affairs added successfully',
      data: {
        id: result.insertId,
        week_affairs_name,
        week_monday,
        week_tuesday,
        week_wednesday,
        week_thursday,
        week_friday,
        week_saturday,
        week_sunday
      }
    });
  });
});

app.delete('/api/user-week-affairs/:id', authenticateToken, (req, res) => {
  const weekId = req.params.id;
  const userId = req.user.id;

  const query = 'DELETE FROM week_affairs WHERE id = ? AND user_id = ?';
  dbTodoList.query(query, [weekId, userId], (err, result) => {
    if (err) {
      console.error('Error deleting week:', err);
      return res.status(500).json({ message: 'Failed to delete week' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Week not found or you do not have permission to delete it' });
    }

    res.status(200).json({ message: 'Week deleted successfully' });
  });
});

process.on('SIGINT', () => {
  clearInterval(updateAllStocks);
  process.exit();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});