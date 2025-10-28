import { useEffect, useMemo, useState } from 'react';
import {
  Container, Row, Col, Card,
  Form, Button, Table,
  Toast, ToastContainer, Badge
} from 'react-bootstrap';

// Kode ini sudah dimodifikasi untuk memenuhi semua kriteria di bagian "Percobaan"

export default function App() {
  // Inisialisasi state dari localStorage, atau gunakan data awal jika kosong
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      return JSON.parse(savedProducts);
    } else {
      return [
        { id: 1, name: 'Makanan', description: 'Produk makanan siap saji', price: 15000, category: 'Makanan', releaseDate: '2024-01-01', stock: 100, isActive: true },
        { id: 2, name: 'Minuman', description: 'Aneka minuman dingin & hangat', price: 5000, category: 'Minuman', releaseDate: '2024-01-02', stock: 150, isActive: true },
      ];
    }
  });

  // State untuk setiap field di form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [stock, setStock] = useState(50); // Default value for slider
  const [isActive, setIsActive] = useState(true);
  
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  // Efek untuk menyimpan data ke localStorage setiap kali 'products' berubah
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const validate = () => {
    const newErrors = {};
    // Validasi Nama
    if (!name.trim()) newErrors.name = 'Nama Produk wajib diisi.';
    else if (name.trim().length > 100) newErrors.name = 'Nama maksimal 100 karakter.';
    
    // Validasi Deskripsi
    if (description.trim().length > 0 && description.trim().length < 20) {
      newErrors.description = 'Deskripsi minimal 20 karakter.';
    }

    // Validasi Harga
    if (!price) newErrors.price = 'Harga wajib diisi.';
    else if (isNaN(price) || Number(price) <= 0) newErrors.price = 'Harga harus angka dan lebih dari 0.';

    // Validasi Kategori
    if (!category) newErrors.category = 'Kategori wajib dipilih.';

    // Validasi Tanggal Rilis
    if (!releaseDate) newErrors.releaseDate = 'Tanggal rilis wajib diisi.';
    else if (new Date(releaseDate) > new Date()) newErrors.releaseDate = 'Tanggal rilis tidak boleh di masa depan.';
    
    return newErrors;
  };
  
  const showToastMsg = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setReleaseDate('');
    setStock(50);
    setIsActive(true);
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToastMsg('Periksa kembali input Anda.', 'danger');
      return;
    }
    setErrors({});

    const productData = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        releaseDate,
        stock: Number(stock),
        isActive
    };

    if (editingId === null) {
      setProducts(prev => [{ id: Date.now(), ...productData }, ...prev]);
      showToastMsg('Produk berhasil ditambahkan.', 'success');
    } else {
      setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...productData } : p));
      showToastMsg('Produk berhasil diperbarui.', 'success');
    }
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price);
    setCategory(product.category);
    setReleaseDate(product.releaseDate);
    setStock(product.stock);
    setIsActive(product.isActive);
    setErrors({});
  };

  const handleDelete = (id) => {
    const target = products.find(p => p.id === id);
    if (window.confirm(`Hapus Produk "${target.name}"?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      if (editingId === id) resetForm();
      showToastMsg('Produk berhasil dihapus.', 'success');
    }
  };

  const descriptionCount = `${description.length}/200`;
  const isEditing = editingId !== null;

  return (
    <>
      <Container className="py-4">
        <Row>
          <Col lg={5}>
            <Card className="mb-4">
              <Card.Header as="h5">{isEditing ? 'Edit Produk' : 'Tambah Produk'}</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit} noValidate>
                  {/* Nama Produk */}
                  <Form.Group className="mb-3" controlId="productName">
                    <Form.Label>Nama Produk</Form.Label>
                    <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} isInvalid={!!errors.name} maxLength={100} />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  </Form.Group>
                  {/* Deskripsi */}
                  <Form.Group className="mb-3" controlId="productDescription">
                    <Form.Label>Deskripsi</Form.Label>
                    <Form.Control as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} isInvalid={!!errors.description} />
                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                  </Form.Group>
                  {/* Harga */}
                  <Form.Group className="mb-3" controlId="productPrice">
                    <Form.Label>Harga</Form.Label>
                    <Form.Control type="number" value={price} onChange={e => setPrice(e.target.value)} isInvalid={!!errors.price} />
                    <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                  </Form.Group>
                   {/* Kategori */}
                  <Form.Group className="mb-3" controlId="productCategory">
                    <Form.Label>Kategori</Form.Label>
                    <Form.Select value={category} onChange={e => setCategory(e.target.value)} isInvalid={!!errors.category}>
                      <option value="">Pilih Kategori...</option>
                      <option value="Makanan">Makanan</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Elektronik">Elektronik</option>
                      <option value="Pakaian">Pakaian</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                  </Form.Group>
                  {/* Tanggal Rilis */}
                  <Form.Group className="mb-3" controlId="productReleaseDate">
                    <Form.Label>Tanggal Rilis</Form.Label>
                    <Form.Control type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} isInvalid={!!errors.releaseDate} />
                    <Form.Control.Feedback type="invalid">{errors.releaseDate}</Form.Control.Feedback>
                  </Form.Group>
                   {/* Stok Tersedia */}
                  <Form.Group className="mb-3" controlId="productStock">
                    <Form.Label>Stok Tersedia: {stock}</Form.Label>
                    <Form.Range min="0" max="1000" value={stock} onChange={e => setStock(e.target.value)} />
                  </Form.Group>
                  {/* Produk Aktif */}
                  <Form.Group className="mb-3" controlId="productIsActive">
                    <Form.Check type="switch" label="Produk Aktif" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                  </Form.Group>
                  
                  <div className="d-flex gap-2">
                    <Button type="submit" variant={isEditing ? 'primary' : 'success'}>{isEditing ? 'Simpan Perubahan' : 'Tambah Produk'}</Button>
                    {isEditing && <Button type="button" variant="secondary" onClick={resetForm}>Batal</Button>}
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={7}>
            <Card>
              <Card.Header as="h5">Daftar Produk</Card.Header>
              <Card.Body className="p-0">
                <Table striped bordered hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nama</th>
                      <th>Harga</th>
                      <th>Kategori</th>
                      <th>Status</th>
                      <th className="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-4 text-muted">Belum ada data Produk.</td></tr>
                    ) : (
                      products.map((product, idx) => (
                        <tr key={product.id}>
                          <td>{idx + 1}</td>
                          <td>{product.name}</td>
                          <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}</td>
                          <td>{product.category}</td>
                          <td>
                            {product.isActive 
                              ? <Badge bg="success">Aktif</Badge> 
                              : <Badge bg="secondary">Tidak Aktif</Badge>}
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <Button size="sm" variant="warning" onClick={() => handleEdit(product)}>Edit</Button>
                              <Button size="sm" variant="danger" onClick={() => handleDelete(product.id)}>Hapus</Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg={toastVariant}>
          <Toast.Header closeButton>
            <strong className="me-auto">Notifikasi</strong>
            <small>Baru saja</small>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'danger' ? 'text-white' : ''}>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}