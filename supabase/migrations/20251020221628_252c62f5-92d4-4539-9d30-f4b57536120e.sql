-- Insert default expense categories
INSERT INTO expensecategories (categoryname, iseditable) VALUES
  ('Marketing', true),
  ('Salários', true),
  ('Infraestrutura', true),
  ('Viagens', true),
  ('Material de Escritório', true),
  ('Software e Licenças', true),
  ('Consultoria', true),
  ('Treinamento', true),
  ('Telefonia e Internet', true),
  ('Outros', true)
ON CONFLICT DO NOTHING;