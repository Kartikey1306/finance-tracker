-- Seed data for personal finance tracker

-- Insert sample user
INSERT INTO users (email, name) VALUES 
('demo@example.com', 'Demo User')
ON CONFLICT (email) DO NOTHING;

-- Get user ID for seeding
DO $$
DECLARE
    demo_user_id INTEGER;
BEGIN
    SELECT id INTO demo_user_id FROM users WHERE email = 'demo@example.com';
    
    -- Insert default categories
    INSERT INTO categories (name, type, color, user_id) VALUES 
    ('Salary', 'income', '#10b981', demo_user_id),
    ('Freelance', 'income', '#059669', demo_user_id),
    ('Investment', 'income', '#047857', demo_user_id),
    ('Rent', 'expense', '#ef4444', demo_user_id),
    ('Groceries', 'expense', '#dc2626', demo_user_id),
    ('Utilities', 'expense', '#b91c1c', demo_user_id),
    ('Transportation', 'expense', '#991b1b', demo_user_id),
    ('Entertainment', 'expense', '#7f1d1d', demo_user_id),
    ('Healthcare', 'expense', '#fbbf24', demo_user_id),
    ('Shopping', 'expense', '#f59e0b', demo_user_id)
    ON CONFLICT DO NOTHING;
    
    -- Insert sample transactions
    INSERT INTO transactions (user_id, category_id, type, amount, description, transaction_date) VALUES 
    (demo_user_id, (SELECT id FROM categories WHERE name = 'Salary' AND user_id = demo_user_id), 'income', 5000.00, 'Monthly salary', '2024-01-15'),
    (demo_user_id, (SELECT id FROM categories WHERE name = 'Freelance' AND user_id = demo_user_id), 'income', 500.00, 'Web design project', '2024-01-20'),
    (demo_user_id, (SELECT id FROM categories WHERE name = 'Rent' AND user_id = demo_user_id), 'expense', 1200.00, 'Monthly rent payment', '2024-01-01'),
    (demo_user_id, (SELECT id FROM categories WHERE name = 'Groceries' AND user_id = demo_user_id), 'expense', 300.00, 'Weekly groceries', '2024-01-10'),
    (demo_user_id, (SELECT id FROM categories WHERE name = 'Utilities' AND user_id = demo_user_id), 'expense', 150.00, 'Electricity bill', '2024-01-05'),
    (demo_user_id, (SELECT id FROM categories WHERE name = 'Entertainment' AND user_id = demo_user_id), 'expense', 80.00, 'Movie tickets', '2024-01-12')
    ON CONFLICT DO NOTHING;
    
    -- Insert sample budgets
    INSERT INTO budgets (user_id, category_id, amount, period, start_date) VALUES 
    (demo_user_id, (SELECT id FROM categories WHERE name = 'Groceries' AND user_id = demo_user_id), 400.00, 'monthly', '2024-01-01'),
    (demo_user_id, (SELECT id FROM categories WHERE name = 'Entertainment' AND user_id = demo_user_id), 200.00, 'monthly', '2024-01-01'),
    (demo_user_id, (SELECT id FROM categories WHERE name = 'Transportation' AND user_id = demo_user_id), 300.00, 'monthly', '2024-01-01')
    ON CONFLICT DO NOTHING;
END $$;
