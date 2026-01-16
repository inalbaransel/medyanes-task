"use client"; // Bu satır, bu sayfanın kullanıcının tarayıcısında çalışacağını söyler. React kancalarını (Hook) kullanmak için şarttır.

import { useEffect, useState } from "react";
import { postAPI, getAPI } from "../services/fetchAPI"; // Yazdığımız servis fonksiyonları
import { useTodoStore } from "../utils/store"; // Depomuz (Global State)
import { Container } from "../components/ui/Container";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, TextArea } from "../components/ui/Input";

export default function Home() {
  //ZUSTAND DEPOSUNDAN VERİLERİ VE FONKSİYONLARI ÇAĞIRMA
  const { todos, setTodos, addTodo, removeTodo, updateTodo } = useTodoStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null); // Hangi todo düzenleniyor?

  useEffect(() => {
    getAPI("/todos").then((data) => {
      setTodos(data);
    });
  }, []);

  //KAYDETME VEYA GÜNCELLEME İŞLEMİ
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (editingId) {
      // GÜNCELLEME (PUT)
      const guncellenenVeri = await postAPI(
        "/todos",
        {
          id: editingId,
          title: title,
          description: description,
        },
        "PUT"
      );

      if (guncellenenVeri) {
        updateTodo(guncellenenVeri);
        setEditingId(null); // Düzenleme modundan çık
        setTitle("");
        setDescription("");
      }
    } else {
      // YENİ EKLEME (POST)
      const yeniVeri = await postAPI("/todos", {
        title: title,
        description: description,
      });

      if (yeniVeri) {
        addTodo(yeniVeri);
        setTitle("");
        setDescription("");
      } else {
        alert("Bir hata oluştu");
      }
    }
  };

  // SİLME İŞLEMİ
  const handleDelete = async (id: any) => {
    await postAPI("/todos", { id: id }, "DELETE");
    removeTodo(id);
  };

  // DÜZENLEME MODUNA GEÇME
  const handleEdit = (todo: any) => {
    setEditingId(todo.id); // Hangi ID olduğunu hafızaya al
    setTitle(todo.title); // Yazıları kutucuklara doldur
    setDescription(todo.description || "");
  };

  // GÜNCELLEME İŞLEMİ (Sadece Tik Atma / Kaldırma)
  const handleToggle = async (todo: any) => {
    const guncellenenVeri = await postAPI(
      "/todos",
      { ...todo, status: !todo.status },
      "PUT"
    );

    if (guncellenenVeri) {
      updateTodo(guncellenenVeri);
    }
  };

  return (
    <Container>
      <div className="w-full max-w-xl mx-auto flex flex-col gap-8">
        <header className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-white tracking-tight drop-shadow-sm">
            Görevler
          </h1>
          <p className="text-white/40 text-lg font-light">
            Neler yapıcağını planla
          </p>
        </header>

        <Card className="p-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-2">
            <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest px-1">
              {editingId ? "Görevi Düzenle" : "Yeni Görev"}
            </h2>
            <Input
              type="text"
              placeholder="Görev başlığı..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg! font-medium placeholder:font-normal"
              required
            />
            <TextArea
              placeholder="Detaylar (isteğe bağlı)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="resize-none"
            />
            <div className="flex gap-2 pt-2">
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setDescription("");
                  }}
                  className="flex-1 rounded-full!"
                >
                  İptal
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                className="flex-2 rounded-full! "
              >
                {editingId ? "Güncelle" : "Oluştur"}
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          {Array.isArray(todos) && todos.length > 0 ? (
            todos.map((todo: any) => (
              <Card
                key={todo.id}
                className="group flex items-start gap-4 p-5! hover:bg-white/10 transition-all duration-300"
              >
                <label className="cursor-pointer relative flex items-center justify-center p-1 rounded-full hover:bg-white/10 transition-colors mt-1">
                  <input
                    type="checkbox"
                    checked={todo.status}
                    onChange={() => handleToggle(todo)}
                    className="appearance-none w-6 h-6 border-[1.5px] border-white/40 rounded-full checked:bg-white checked:border-white transition-all cursor-pointer relative z-10"
                  />
                  {todo.status && (
                    <svg
                      className="w-3.5 h-3.5 text-black absolute z-20 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="4"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  )}
                </label>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold text-[17px] leading-snug transition-all ${
                      todo.status ? "text-white/30 line-through" : "text-white"
                    }`}
                  >
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p
                      className={`text-white/50 text-sm mt-1 leading-relaxed ${
                        todo.status ? "text-white/20" : ""
                      }`}
                    >
                      {todo.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                  <Button
                    onClick={() => handleEdit(todo)}
                    variant="ghost"
                    className="p-2! text-white/40 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536M9 11l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L10.5 11z"
                      ></path>
                    </svg>
                  </Button>

                  <Button
                    onClick={() => handleDelete(todo.id)}
                    variant="ghost"
                    className="p-2! text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-white/20">
              <p>Henüz görev yok</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
