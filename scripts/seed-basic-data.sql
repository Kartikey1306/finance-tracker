-- Seed data for basic transaction tracker

INSERT INTO transactions (amount, date, description) VALUES 
(1200.00, '2024-01-01', 'Monthly rent payment'),
(300.00, '2024-01-05', 'Grocery shopping at supermarket'),
(150.00, '2024-01-10', 'Electricity bill payment'),
(80.00, '2024-01-15', 'Gas station fill-up'),
(200.00, '2024-01-20', 'Restaurant dinner with friends'),
(45.00, '2024-01-22', 'Coffee shop visit'),
(120.00, '2024-01-25', 'Internet and phone bill'),
(75.00, '2024-01-28', 'Pharmacy prescription'),
(250.00, '2024-02-01', 'Car maintenance service'),
(180.00, '2024-02-05', 'Weekly grocery shopping')
ON CONFLICT DO NOTHING;
