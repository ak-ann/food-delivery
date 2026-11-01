
import { useEffect, useState } from 'react';
import './App.css';

const STORAGE_KEY = 'food-delivery-orders';

const initialOrders = [
  {
    id: 1,
    customerName: 'Анна Иванова',
    restaurant: 'Bella Napoli',
    items: 'Пицца Маргарита, лимонад',
    totalPrice: 32.5,
    status: 'В обработке',
  },
  {
    id: 2,
    customerName: 'Максим Петров',
    restaurant: 'Burger House',
    items: 'Двойной бургер, картофель фри',
    totalPrice: 27.9,
    status: 'Доставляется',
  },
  {
    id: 3,
    customerName: 'Екатерина Смирнова',
    restaurant: 'Sushi Time',
    items: 'Филадельфия, ролл Калифорния',
    totalPrice: 45,
    status: 'Доставлен',
  },
];

const emptyForm = {
  customerName: '',
  restaurant: '',
  items: '',
  totalPrice: '',
  status: 'В обработке',
};

function loadOrders() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Не удалось загрузить заказы:', error);
  }

  return initialOrders;
}

function App() {
  const [orders, setOrders] = useState(loadOrders);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Все');
  const [notice, setNotice] = useState('');


  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(orders)
        );
      } catch (error) {
        console.error('Не удалось сохранить заказы:', error);
        setNotice('Не удалось сохранить данные браузера');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [orders]);

  
  useEffect(() => {
    document.title = `Заказы (${orders.length}) | Food Delivery`;

    return () => {
      document.title = 'Food Delivery';
    };
  }, [orders.length]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const price = Number(form.totalPrice);

    if (
      !form.customerName.trim() ||
      !form.restaurant.trim() ||
      !form.items.trim() ||
      form.totalPrice === '' ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setNotice('Заполни все поля и укажи корректную сумму');
      return;
    }

    if (editingId !== null) {
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === editingId
            ? {
                ...order,
                ...form,
                customerName: form.customerName.trim(),
                restaurant: form.restaurant.trim(),
                items: form.items.trim(),
                totalPrice: price,
              }
            : order
        )
      );

      setNotice('Изменения заказа сохранены');
    } else {
      const newOrder = {
        id: Date.now(),
        ...form,
        customerName: form.customerName.trim(),
        restaurant: form.restaurant.trim(),
        items: form.items.trim(),
        totalPrice: price,
      };

      setOrders((previousOrders) => [
        newOrder,
        ...previousOrders,
      ]);

      setNotice('Новый заказ добавлен');
    }

    setForm(emptyForm);
    setEditingId(null);
  }

  function startEditing(order) {
    setEditingId(order.id);

    setForm({
      customerName: order.customerName,
      restaurant: order.restaurant,
      items: order.items,
      totalPrice: String(order.totalPrice),
      status: order.status,
    });

    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function deleteOrder(id) {
    setOrders((previousOrders) =>
      previousOrders.filter((order) => order.id !== id)
    );

    if (editingId === id) {
      cancelEditing();
    }

    setNotice('Заказ удалён');
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    setNotice('');
  }

  const filteredOrders = orders.filter((order) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      order.customerName.toLowerCase().includes(query) ||
      order.restaurant.toLowerCase().includes(query) ||
      order.items.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === 'Все' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalAmount = orders.reduce(
    (sum, order) => sum + Number(order.totalPrice),
    0
  );

  const statusClass = {
    'В обработке': 'processing',
    'Доставляется': 'delivering',
    'Доставлен': 'delivered',
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-icon">F</span>
          <span>
            <strong>Food Delivery</strong>
            <small>Сервис управления заказами</small>
          </span>
        </a>

        <span className="topbar-label">
          Панель управления
        </span>
      </header>

      <main className="page-content" id="home">
        <section className="hero">
          <div>
            <span className="eyebrow">ORDER MANAGEMENT</span>
            <h1>Управление заказами</h1>
            <p>
              Все заказы доставки еды в одном месте.
              Добавляй, редактируй и отслеживай их статус.
            </p>
          </div>

          <div className="hero-mark" aria-hidden="true">
            <span>FD</span>
          </div>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <span className="stat-label">Всего заказов</span>
            <strong>{orders.length}</strong>
            <span className="stat-foot">В локальном списке</span>
          </article>

          <article className="stat-card">
            <span className="stat-label">В обработке</span>
            <strong>
              {orders.filter(
                (order) => order.status === 'В обработке'
              ).length}
            </strong>
            <span className="stat-foot">Ожидают приготовления</span>
          </article>

          <article className="stat-card">
            <span className="stat-label">Доставляются</span>
            <strong>
              {orders.filter(
                (order) => order.status === 'Доставляется'
              ).length}
            </strong>
            <span className="stat-foot">Уже в пути</span>
          </article>

          <article className="stat-card stat-card-accent">
            <span className="stat-label">Сумма заказов</span>
            <strong>{totalAmount.toFixed(2)} BYN</strong>
            <span className="stat-foot">По всем заказам</span>
          </article>
        </section>

        <section className="workspace">
          <div className="panel form-panel">
            <div className="panel-heading">
              <div className="section-icon">+</div>
              <div>
                <h2>
                  {editingId !== null
                    ? 'Редактирование заказа'
                    : 'Новый заказ'}
                </h2>
                <p>Заполни информацию о заказе</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="order-form">
              <label>
                Имя клиента
                <input
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Например, Анна Иванова"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Ресторан
                <input
                  name="restaurant"
                  value={form.restaurant}
                  onChange={handleChange}
                  placeholder="Название ресторана"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Состав заказа
                <textarea
                  name="items"
                  value={form.items}
                  onChange={handleChange}
                  placeholder="Пицца, напиток..."
                  rows={3}
                  maxLength={500}
                  required
                />
              </label>

              <div className="form-row">
                <label>
                  Сумма (BYN)
                  <input
                    name="totalPrice"
                    type="number"
                    value={form.totalPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </label>

                <label>
                  Статус
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>В обработке</option>
                    <option>Доставляется</option>
                    <option>Доставлен</option>
                  </select>
                </label>
              </div>

              <button className="primary-button" type="submit">
                {editingId !== null
                  ? 'Сохранить изменения'
                  : 'Добавить заказ'}
              </button>

              {editingId !== null && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={cancelEditing}
                >
                  Отменить редактирование
                </button>
              )}

              {notice && (
                <p className="notice" role="status">
                  {notice}
                </p>
              )}
            </form>
          </div>

          <div className="panel list-panel">
            <div className="list-heading">
              <div>
                <span className="eyebrow">YOUR ORDERS</span>
                <h2>Список заказов</h2>
                <p>Найдено: {filteredOrders.length}</p>
              </div>

              <span className="count-badge">{orders.length}</span>
            </div>

            <div className="filters">
              <label className="search-box">
                <span aria-hidden="true">⌕</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Поиск по заказам..."
                  aria-label="Поиск по заказам"
                />
              </label>

              <label className="filter-select">
                <span>Статус</span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  <option>Все</option>
                  <option>В обработке</option>
                  <option>Доставляется</option>
                  <option>Доставлен</option>
                </select>
              </label>
            </div>

            <div className="orders-list">
              {filteredOrders.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">⌕</span>
                  <h3>Заказы не найдены</h3>
                  <p>Измени поисковый запрос или фильтр.</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <article className="order-card" key={order.id}>
                    <div className="order-card-top">
                      <div className="order-number">
                        <span className="order-icon">№</span>
                        <div>
                          <strong>
                            Заказ #{String(order.id).slice(-6)}
                          </strong>
                          <small>{order.customerName}</small>
                        </div>
                      </div>

                      <span
                        className={`status-badge ${
                          statusClass[order.status] || 'processing'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="order-details">
                      <div>
                        <span>Ресторан</span>
                        <strong>{order.restaurant}</strong>
                      </div>

                      <div>
                        <span>Состав</span>
                        <strong>{order.items}</strong>
                      </div>
                    </div>

                    <div className="order-card-bottom">
                      <strong className="order-price">
                        {Number(order.totalPrice).toFixed(2)} BYN
                      </strong>

                      <div className="card-actions">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => startEditing(order)}
                        >
                          Изменить
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => deleteOrder(order.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            <p className="storage-note">
              <span className="storage-dot" />
              Данные сохраняются в браузере автоматически
            </p>
          </div>
        </section>

        <footer className="page-footer">
          <span>FOOD DELIVERY</span>
          <span>React · Локальное управление заказами</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
