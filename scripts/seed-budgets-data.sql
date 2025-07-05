-- Seed data for budgets and enhanced transactions

-- Insert predefined categories
INSERT INTO categories (name, icon, color) VALUES 
('Groceries', 'ShoppingCart', '#ef4444'),
('Rent', 'Home', '#dc2626'),
('Transportation', 'Car', '#b91c1c'),
('Dining', 'Utensils', '#991b1b'),
('Entertainment', 'Gamepad2', '#7f1d1d'),
('Healthcare', 'Heart', '#fbbf24'),
('Shopping', 'Shirt', '#f59e0b'),
('Utilities', 'Zap', '#d97706'),
('Other', 'MoreHorizontal', '#a3a3a3')
ON CONFLICT (name) DO NOTHING;

-- Insert sample transactions with categories
INSERT INTO transactions (amount, date, description, category_id) VALUES 
(1200.00, '2024-01-01', 'Monthly rent payment', (SELECT id FROM categories WHERE name = 'Rent')),
(300.00, '2024-01-05', 'Grocery shopping at supermarket', (SELECT id FROM categories WHERE name = 'Groceries')),
(150.00, '2024-01-10', 'Electricity bill payment', (SELECT id FROM categories WHERE name = 'Utilities')),
(80.00, '2024-01-15', 'Gas station fill-up', (SELECT id FROM categories WHERE name = 'Transportation')),
(200.00, '2024-01-20', 'Restaurant dinner with friends', (SELECT id FROM categories WHERE name = 'Dining')),
(120.00, '2024-01-22', 'Movie tickets and popcorn', (SELECT id FROM categories WHERE name = 'Entertainment')),
(75.00, '2024-01-25', 'Pharmacy prescription', (SELECT id FROM categories WHERE name = 'Healthcare')),
(250.00, '2024-02-01', 'New winter clothes', (SELECT id FROM categories WHERE name = 'Shopping')),
(180.00, '2024-02-05', 'Weekly grocery shopping', (SELECT id FROM categories WHERE name = 'Groceries')),
(90.00, '2024-02-08', 'Internet and phone bill', (SELECT id FROM categories WHERE name = 'Utilities')),
(45.00, '2024-02-10', 'Coffee shop visit', (SELECT id FROM categories WHERE name = 'Other')),
(160.00, '2024-02-12', 'Car maintenance service', (SELECT id FROM categories WHERE name = 'Transportation'))
ON CONFLICT DO NOTHING;

-- Insert sample budgets for February 2024
INSERT INTO budgets (category_id, amount, month) VALUES 
((SELECT id FROM categories WHERE name = 'Groceries'), 400.00, '2024-02-01'),
((SELECT id FROM categories WHERE name = 'Rent'), 1200.00, '2024-02-01'),
((SELECT id FROM categories WHERE name = 'Transportation'), 200.00, '2024-02-01'),
((SELECT id FROM categories WHERE name = 'Dining'), 300.00, '2024-02-01'),
((SELECT id FROM categories WHERE name = 'Entertainment'), 150.00, '2024-02-01'),
((SELECT id FROM categories WHERE name = 'Healthcare'), 100.00, '2024-02-01'),
((SELECT id FROM categories WHERE name = 'Shopping'), 200.00, '2024-02-01'),
((SELECT id FROM categories WHERE name = 'Utilities'), 200.00, '2024-02-01')
ON CONFLICT (category_id, month) DO NOTHING;

-- Insert sample budgets for March 2024 (current month for demo)
INSERT INTO budgets (category_id, amount, month) VALUES 
((SELECT id FROM categories WHERE name = 'Groceries'), 450.00, '2024-03-01'),
((SELECT id FROM categories WHERE name = 'Rent'), 1200.00, '2024-03-01'),
((SELECT id FROM categories WHERE name = 'Transportation'), 250.00, '2024-03-01'),
((SELECT id FROM categories WHERE name = 'Dining'), 350.00, '2024-03-01'),
((SELECT id FROM categories WHERE name = 'Entertainment'), 200.00, '2024-03-01'),
((SELECT id FROM categories WHERE name = 'Utilities'), 180.00, '2024-03-01')
ON CONFLICT (category_id, month) DO NOTHING;
