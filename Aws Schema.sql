-- ================================
-- CREATE & USE DATABASE
-- ================================
CREATE SCHEMA IF NOT EXISTS aws_vechile_auction;
USE aws_vechile_auction;

-- ================================
-- USERS & ROLES
-- ================================

CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(15),
    address VARCHAR(255),
    status ENUM('ACTIVE','INACTIVE'),
    created_on DATETIME(6),
    last_updated DATETIME(6)
);

CREATE TABLE roles (
    role_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name ENUM('ROLE_ADMIN','ROLE_BUYER','ROLE_SELLER') NOT NULL UNIQUE
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

-- ================================
-- CARS & IMAGES
-- ================================

CREATE TABLE cars (
    car_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    registration_no VARCHAR(20) NOT NULL UNIQUE,
    price DOUBLE NOT NULL,
    mileage INT,
    km_driven INT NOT NULL,
    engine_cc INT,
    fuel_type ENUM('DIESEL','ELECTRIC','HYBRID','PETROL') NOT NULL,
    transmission ENUM('AUTOMATIC','MANUAL') NOT NULL,
    color VARCHAR(30),
    description TEXT,
    manufacture_year INT,
    sale_type ENUM('AUCTION','DIRECT') NOT NULL,
    status ENUM(
        'DRAFT','PENDING_APPROVAL','AVAILABLE',
        'UNDER_AUCTION','AUCTION_COMPLETED',
        'SOLD','CANCELLED'
    ) NOT NULL,
    auction_attempts INT NOT NULL,
    last_auction_ended_at DATETIME(6),
    seller_id BIGINT NOT NULL,
    created_on DATETIME(6),
    last_updated DATETIME(6),
    FOREIGN KEY (seller_id) REFERENCES users(user_id)
);

CREATE TABLE car_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(255) NOT NULL,
    car_id BIGINT NOT NULL,
    FOREIGN KEY (car_id) REFERENCES cars(car_id) ON DELETE CASCADE
);

-- ================================
-- AUCTIONS & BIDS
-- ================================

CREATE TABLE auctions (
    auction_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    start_price DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2),
    start_time DATETIME(6) NOT NULL,
    end_time DATETIME(6) NOT NULL,
    status ENUM('ACTIVE','COMPLETED') NOT NULL,
    paid BIT(1) NOT NULL,
    payment_status ENUM('CREATED','FAILED','SUCCESS'),
    payment_time DATETIME(6),
    car_id BIGINT NOT NULL UNIQUE,
    winner_id BIGINT,
    created_on DATETIME(6),
    last_updated DATETIME(6),
    FOREIGN KEY (car_id) REFERENCES cars(car_id),
    FOREIGN KEY (winner_id) REFERENCES users(user_id)
);

CREATE TABLE bids (
    bid_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bid_amount DECIMAL(10,2) NOT NULL,
    bid_time DATETIME(6) NOT NULL,
    auction_id BIGINT NOT NULL,
    bidder_id BIGINT NOT NULL,
    FOREIGN KEY (auction_id) REFERENCES auctions(auction_id) ON DELETE CASCADE,
    FOREIGN KEY (bidder_id) REFERENCES users(user_id)
);

-- ================================
-- CART & CART ITEMS
-- ================================

CREATE TABLE cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    created_on DATETIME(6),
    last_updated DATETIME(6),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cart_id BIGINT NOT NULL,
    car_id BIGINT NOT NULL,
    price_at_add_time DOUBLE NOT NULL,
    created_on DATETIME(6),
    last_updated DATETIME(6),
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(car_id)
);

-- ================================
-- ORDERS & ORDER ITEMS
-- ================================

CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_time DATETIME(6),
    total_amount DOUBLE NOT NULL,
    status ENUM('PENDING','SUCCESS','FAILED'),
    payment_id BIGINT UNIQUE,
    user_id BIGINT NOT NULL,
    created_on DATETIME(6),
    last_updated DATETIME(6),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    car_id BIGINT NOT NULL,
    brand VARCHAR(255),
    model VARCHAR(255),
    price_at_purchase DOUBLE NOT NULL,
    created_on DATETIME(6),
    last_updated DATETIME(6),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(car_id)
);

-- ================================
-- PAYMENTS
-- ================================

CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    amount DOUBLE,
    payment_for ENUM('AUCTION_WIN','CAR_PURCHASE','SUBSCRIPTION'),
    status ENUM('CREATED','FAILED','SUCCESS'),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    reference_id BIGINT,
    user_id BIGINT,
    payment_time DATETIME(6),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ================================
-- SUBSCRIPTIONS
-- ================================

CREATE TABLE subscription_plans (
    plan_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    plan_name ENUM('BASIC','PREMIUM') NOT NULL UNIQUE,
    price DOUBLE NOT NULL,
    total_bids INT,
    bids_per_auction INT,
    validity_days INT NOT NULL
);

CREATE TABLE user_subscriptions (
    subscription_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    bids_remaining INT,
    start_date DATETIME(6),
    end_date DATETIME(6),
    status ENUM('ACTIVE','EXPIRED') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id)
);
