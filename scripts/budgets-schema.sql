-- Enhanced schema with budgets for Stage 3

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    date DATE NOT NULL,
    description TEXT NOT NULL CHECK (LENGTH(TRIM(description)) >= 3),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    month DATE NOT NULL, -- First day of the month (YYYY-MM-01)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, month) -- One budget per category per month
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_budgets_month ON budgets(month);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category_id);

-- Create a view for budget vs actual analysis
CREATE OR REPLACE VIEW budget_vs_actual AS
SELECT 
    c.name as category_name,
    b.amount as budget_amount,
    b.month as budget_month,
    COALESCE(SUM(t.amount), 0) as actual_amount,
    (b.amount - COALESCE(SUM(t.amount), 0)) as remaining_amount,
    CASE 
        WHEN COALESCE(SUM(t.amount), 0) > b.amount THEN true 
        ELSE false 
    END as over_budget
FROM budgets b
JOIN categories c ON b.category_id = c.id
LEFT JOIN transactions t ON t.category_id = b.category_id 
    AND DATE_TRUNC('month', t.date) = b.month
GROUP BY c.name, b.amount, b.month, b.id
ORDER BY b.month DESC, c.name;
