# Pizzeria — MEAN Stack Capstone Project

A full-stack pizza ordering application built with **MongoDB, Express, Angular, and Node.js**.

Users can browse the story/landing page, order pre-made pizzas, build a custom pizza from
individual ingredients, manage a shopping cart (quantities, subtotal, live pricing), and
check out.

## Project structure

```
pizzeria-mean/
├── backend/          Express + MongoDB REST API
│   ├── config/db.js       Mongo connection
│   ├── models/             Pizza, Ingredient, Order (Mongoose schemas)
│   ├── routes/             /api/pizzas, /api/ingredients, /api/orders
│   ├── seed.js              Populates the DB with menu + ingredient data
│   └── server.js            App entry point
└── frontend/          Angular 17 (standalone components)
    └── src/app/
        ├── components/
        │   ├── navbar/         Top nav — logo, links, cart badge
        │   ├── home/           "Our story" landing page
        │   ├── order-pizza/    Pizza menu grid + Add to Cart
        │   ├── build-pizza/    Ingredient picker + dynamic total
        │   └── cart/           Cart, quantities, totals, Pay/Clear
        ├── services/           PizzaService, IngredientService, CartService
        └── models/             TypeScript interfaces
```

## Core features implemented

- **Browse pizzas** with name, description, price, image, veg/non-veg indicator,
  ingredients, and toppings (Order Pizza page).
- **Build Your Pizza**: pick ingredients from a checklist; the total cost updates live as
  you check/uncheck items.
- **Cart management**: add, increase/decrease quantity, remove items; works for both
  ready-made pizzas and custom-built pizzas.
- **Dynamic pricing**: cart shows a pizza subtotal, an ingredients subtotal (from custom
  pizzas), and a combined total — recalculated automatically on every change.
- **Checkout**: "Pay" posts the order to the API and persists it in MongoDB; "Clear"
  empties the cart.
- Cart state survives page refresh via `sessionStorage`, and is managed centrally through
  an RxJS `BehaviorSubject` in `CartService` (single source of truth / reactive state
  management).

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a connection string to
  MongoDB Atlas

## 1. Run the backend

```bash
cd backend
npm install
cp .env.example .env      # edit MONGO_URI if needed
npm run seed               # loads sample pizzas + ingredients into MongoDB
npm run dev                 # starts the API on http://localhost:5000 (nodemon)
```

Verify it's running: `GET http://localhost:5000/` → `{ "message": "Pizzeria API is running" }`

### API endpoints

| Method | Route                | Description                        |
|--------|-----------------------|-------------------------------------|
| GET    | /api/pizzas            | List all pizzas                     |
| GET    | /api/pizzas/:id         | Get one pizza                       |
| POST   | /api/pizzas             | Create a pizza                      |
| PUT    | /api/pizzas/:id         | Update a pizza                      |
| DELETE | /api/pizzas/:id         | Delete a pizza                      |
| GET    | /api/ingredients        | List all ingredients                |
| POST   | /api/ingredients        | Create an ingredient                |
| GET    | /api/orders             | List past orders                    |
| POST   | /api/orders             | Place an order (checkout / Pay)     |

## 2. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm start                   # ng serve, http://localhost:4200
```

Open **http://localhost:4200** — the Angular app calls the API at
`http://localhost:5000/api` (configured in `src/environments/environment.ts`).

## Design notes / rubric mapping

- **Functionality**: full browse → customize → cart → checkout flow, backed by real API
  calls (no mocked data in the frontend).
- **UI/UX**: layout, colors, and page flow follow the provided mockups (dark navbar with
  orange accents, pizza grid, ingredient checklist, two-column cart with order summary).
- **Code quality**: Angular standalone components, one responsibility per component,
  typed models (`Pizza`, `Ingredient`, `CartItem`), services for all HTTP/state logic —
  components stay presentation-focused.
- **State management**: `CartService` is the single source of truth for the cart,
  exposed as an observable (`items$`) that the navbar badge, cart page, and totals all
  subscribe to — no duplicated state.
- **Validation & linting**: reactive forms patterns via `[(ngModel)]` with disabled states
  (e.g. "Build Ur Pizza" is disabled until at least one ingredient is selected; "Pay" is
  disabled while a request is in flight); backend validates request bodies before writing
  to MongoDB and returns 400s with messages on bad input.

## Next steps you may want to add

- User authentication (login/signup) if the rubric expands to multi-user support
- Order history page (`GET /api/orders` is already implemented server-side)
- Image uploads for admin-managed pizzas/ingredients instead of hard-coded URLs
- Unit tests (Jasmine/Karma on the frontend, Jest/Supertest on the backend)
