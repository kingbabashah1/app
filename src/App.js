import React, { useState } from 'react';
import { Button, Input } from 'antd';
import Swal from 'sweetalert2';
import './FilmManager.css';
import { copyFileToUSB } from './filmManager';

function App() {
  const [films, setFilms] = useState([]);
  const [newFilmPath, setNewFilmPath] = useState('');

  const addFilm = () => {
    if (!newFilmPath) {
      Swal.fire({
        icon: 'error',
        title: 'خطا',
        text: 'لطفا مسیر فایل فیلم را وارد کنید.'
      });
      return;
    }
    setFilms([...films, { path: newFilmPath, name: newFilmPath.split(/[\\/]/).pop() }]);
    setNewFilmPath('');
  };

  const removeFilm = idx => {
    Swal.fire({
      title: 'حذف فیلم',
      text: 'آیا مطمئن هستید که این فیلم حذف شود؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'بله، حذف شود',
      cancelButtonText: 'انصراف'
    }).then(result => {
      if (result.isConfirmed) {
        setFilms(films.filter((_, i) => i !== idx));
      }
    });
  };

  const handleCopyToUSB = film => {
    Swal.fire({
      title: 'کپی به فلش',
      text: 'آیا مطمئن هستید که این فیلم به فلش متصل شده منتقل شود؟',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'بله، کپی کن',
      cancelButtonText: 'انصراف'
    }).then(result => {
      if (result.isConfirmed) {
        copyFileToUSB(film.path, (err, dest) => {
          if (err) {
            Swal.fire({
              icon: 'error',
              title: 'خطا',
              text: err.message || 'مشکلی در کپی فایل پیش آمد.'
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'موفقیت',
              text: `فیلم با موفقیت به فلش منتقل شد!\n${dest}`
            });
          }
        });
      }
    });
  };

  return (
    <div className="film-manager-container">
      <h2 style={{color:'#3c4251', fontWeight:'bold'}}>مدیریت فیلم‌ها و ارسال به فلش</h2>
      <form className="add-film-form" onSubmit={e => { e.preventDefault(); addFilm(); }}>
        <Input
          style={{maxWidth:400}}
          placeholder="مسیر کامل فیلم را وارد کنید..."
          value={newFilmPath}
          onChange={e => setNewFilmPath(e.target.value)}
          dir="ltr"
        />
        <Button type="primary" onClick={addFilm}>افزودن فیلم</Button>
      </form>
      <div className="film-list">
        <div className="film-list-title">لیست فیلم‌ها</div>
        {films.length === 0 && <div style={{padding:'20px'}}>هنوز فیلمی اضافه نشده است.</div>}
        {films.map((film, idx) => (
          <div className="film-item" key={idx}>
            <div>
              <span style={{fontWeight:'bold', color:'#222'}}>{film.name}</span>
              <span className="film-path">{film.path}</span>
            </div>
            <div className="film-actions">
              <Button type="primary" onClick={() => handleCopyToUSB(film)}>کپی به فلش</Button>
              <Button type="default" danger onClick={() => removeFilm(idx)}>حذف</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;