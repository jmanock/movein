UPDATE providers
SET status = 'inactive'
WHERE category_id = (SELECT id FROM provider_categories WHERE slug = 'natural-gas');
