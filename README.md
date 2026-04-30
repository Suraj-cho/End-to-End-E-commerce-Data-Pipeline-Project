# End-to-End-E-commerce-Data-Pipeline-Project


# Project Overview

This project is a full-stack e-commerce analytics system that integrates a React frontend, Flask backend API, MySQL database, SQL views, and Power BI dashboards. The application simulates product purchases, stores transactions in MySQL, preprocesses data using SQL views, and visualizes business insights through Power BI.

# Architecture Diagram
'''
┌────────────────────┐
│  React Frontend    │
│  (E-commerce UI)   │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Flask Backend API  │
│ (/products,/order) │
└─────────┬──────────┘
          ↓
┌─────────────────────────────────────┐
│        MySQL Database              │
│ customers | products | orders      │
└─────────┬───────────────────────────┘
          ↓
┌────────────────────┐
│ sales_data SQL VIEW│
│ JOIN + preprocessing│
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Power BI Dashboard │
│ KPIs + Analytics   │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Business Insights  │
│ Revenue • Profit   │
│ Trends • Products  │
└────────────────────┘
'''
 ![Image Alt](https://github.com/Suraj-cho/End-to-End-E-commerce-Data-Pipeline-Project/blob/743fdc48dcd8506c71ad704f044a743399755851/flow.jpg)


 Features

1 . Frontend

React + Vite frontend
Product catalogue
Buy product functionality
Orders page
Quantity selection

2 . Backend

Flask REST API
Order processing
MySQL integration
API endpoints for products and orders

3 . Database

Customers table
Products table
Orders table
sales_data SQL view

4 . Analytics

Power BI dashboard
Revenue KPIs
Profit KPIs
Top-selling products
Sales trend analysis
