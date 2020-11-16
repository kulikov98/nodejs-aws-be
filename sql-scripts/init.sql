create table products (
    id uuid primary key default uuid_generate_v4(),
    title varchar(255) not null,
    description text,
    price integer
);

create table stocks (
    id uuid primary key default uuid_generate_v4(),
    "productId" uuid references products(id),
    count integer
);

create extension if not exists "uuid-ossp";


-- product 1
with product_insert as (
   insert into products (title, description, price)
   values ('BYGGLEK', '201-piece LEGO® brick set, mixed colors', 14.99)
   RETURNING id
)
insert into stocks ("productId", count) values
((select id from product_insert), 10);

-- product 2
with product_insert as (
   insert into products (title, description, price)
   values ('LILLABO', '45-piece train set with track', 29.99)
   RETURNING id
)
insert into stocks ("productId", count) values
((select id from product_insert), 20);

-- product 3
with product_insert as (
   insert into products (title, description, price)
   values ('MÅLA', 'Watercolor box, mixed colors', 7.99)
   RETURNING id
)
insert into stocks ("productId", count) values
((select id from product_insert), 20);
