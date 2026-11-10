import { useEffect, useState } from 'react';
import {
  fetchOrders,
  addOrder,
  updateOrder,
  deleteOrder,
} from './api';
import './Orders.css';

const emptyForm = {
  customerName: '',
  phone: '',
  address: '',
  restaurant: '',
  items: '',
  totalPrice: '',
  status: 'В обработке',
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  
  const loadOrders = async (signal) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetchOrders({ signal });
      setOrders(response.data);
    } catch (err) {
      if (err.code !== 'ERR_CANCELED') {
        setError('Не удалось загрузить заказы');
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    loadOrders(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };


  const prepareOrder = () => ({
    ...form,
    items: form.items
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    totalPrice: Number(form.totalPrice),
  });


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    const order = prepareOrder();

    setSaving(true);
    setNotice('');
    setError('');

    if (editingId === null) {
     
      const tempId = `temp-${Date.now()}`;

      setOrders((prev) => [
        ...prev,
        { ...order, id: tempId },
      ]);

      resetForm();

      try {
        const response = await addOrder(order);

        const createdOrder = response.data;

        setOrders((prev) =>
          prev.map((item) =>
            item.id === tempId ? createdOrder : item
          )
        );

        setNotice('Заказ успешно добавлен');
      } catch (err) {
        setOrders((prev) =>
          prev.filter((item) => item.id !== tempId)
        );

        setNotice('Не удалось добавить заказ');
      }
    } else {
      
      const oldOrder = orders.find(
        (item) => item.id === editingId
      );

      setOrders((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...order }
            : item
        )
      );

      resetForm();

      try {
        const response = await updateOrder(editingId, order);

        setOrders((prev) =>
          prev.map((item) =>
            item.id === editingId ? response.data : item
          )
        );

        setNotice('Заказ успешно изменён');
      } catch (err) {
        setOrders((prev) =>
          prev.map((item) =>
            item.id === editingId ? oldOrder : item
          )
        );

        setNotice('Не удалось изменить заказ');
      }
    }

    setSaving(false);
  };


  const handleEdit = (order) => {
    setEditingId(order.id);

    setForm({
      customerName: order.customerName ?? '',
      phone: order.phone ?? '',
      address: order.address ?? '',
      restaurant: order.restaurant ?? '',
      items: Array.isArray(order.items)
        ? order.items.join(', ')
        : order.items ?? '',
      totalPrice: String(order.totalPrice ?? ''),
      status: order.status ?? 'В обработке',
    });

    setNotice('');
  };

  
  const handleDelete = async (id) => {
    const oldOrder = orders.find(
      (item) => item.id === id
    );

    setOrders((prev) =>
      prev.filter((item) => item.id !== id)
    );

    setNotice('');

    try {
      await deleteOrder(id);

      setNotice('Заказ успешно удалён');
    } catch (err) {
      setOrders((prev) => [...prev, oldOrder]);

      setNotice('Не удалось удалить заказ');
    }
  };

  return (
    <main className="orders-page">
      <h1>Заказы доставки еды</h1>

      <form className="order-form" onSubmit={handleSubmit}>
        <h2>
          {editingId === null
            ? 'Добавить заказ'
            : 'Редактировать заказ'}
        </h2>

        <input
          name="customerName"
          placeholder="Имя клиента"
          value={form.customerName}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Телефон"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          name="address"
          placeholder="Адрес доставки"
          value={form.address}
          onChange={handleChange}
          required
        />

        <input
          name="restaurant"
          placeholder="Ресторан"
          value={form.restaurant}
          onChange={handleChange}
          required
        />

        <input
          name="items"
          placeholder="Товары через запятую"
          value={form.items}
          onChange={handleChange}
          required
        />

        <input
          name="totalPrice"
          type="number"
          min="0"
          step="0.01"
          placeholder="Стоимость заказа"
          value={form.totalPrice}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option>В обработке</option>
          <option>Доставляется</option>
          <option>Доставлен</option>
        </select>

        <button type="submit" disabled={saving}>
          {editingId === null
            ? 'Добавить заказ'
            : 'Сохранить изменения'}
        </button>

        {editingId !== null && (
          <button type="button" onClick={resetForm}>
            Отмена
          </button>
        )}
      </form>

      {notice && <p className="notice">{notice}</p>}

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>Загрузка заказов...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={() => loadOrders()}>
            Повторить
          </button>
        </div>
      )}

      {!loading && !error && (
        <section className="orders-list">
          <h2>Список заказов</h2>

          {orders.length === 0 && (
            <p>Заказов пока нет</p>
          )}

          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <h3>Заказ №{order.id}</h3>

              <p>Клиент: {order.customerName}</p>
              <p>Телефон: {order.phone}</p>
              <p>Адрес: {order.address}</p>
              <p>Ресторан: {order.restaurant}</p>

              <p>
                Товары: {Array.isArray(order.items)
                  ? order.items.join(', ')
                  : order.items}
              </p>

              <p>Стоимость: {order.totalPrice} BYN</p>
              <p>Статус: {order.status}</p>

              <div className="order-actions">
                <button onClick={() => handleEdit(order)}>
                  Редактировать
                </button>

                <button
                  onClick={() => handleDelete(order.id)}
                >
                  Удалить
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Orders;