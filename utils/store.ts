import { create } from "zustand";

// Herhangi bir sayfa buradan veri (todo) alabilir veya veri koyabilir.

// Store oluşturuyoruz.
// set: Bu fonksiyon depodaki veriyi değiştiriyor
export const useTodoStore = create<any>((set: any) => ({
  todos: [], // Başlangıçta sepetimiz boş.

  //LİSTEYİ GÜNCELLEME (API'den gelince)
  // Gelen veri (data) dizi mi kontrol ediyoruz. Diziyse koyuyoruz, değilse boş dizi koyuyoruz.
  setTodos: (data: any) => set({ todos: Array.isArray(data) ? data : [] }),

  //YENİ GÖREV EKLEME
  // ...state.todos -> "Eski listeyi kopyala" demek.
  // [item, ...state.todos] -> Yeni geleni başa koy, eskileri arkasına ekle demek.
  addTodo: (item: any) =>
    set((state: any) => ({
      todos: [item, ...state.todos],
    })),

  // SİLME
  // .filter() -> Süzgeç fonksiyonu.
  // Mantık: "ID'si, silinecek ID'ye eşit OLMAYANLARI tut". (Yani onu dışarı at)
  removeTodo: (id: any) =>
    set((state: any) => ({
      todos: state.todos.filter((t: any) => t.id !== id),
    })),

  // DURUMU DEĞİŞTİRME (Tik Atma)
  // .map() -> Listeyi tek tek gezer.
  // Mantık: "Eğer bu satırın ID'si aradığımız ID ise, onun status'ünü değiştir. Değilse aynen kalsın."
  toggleTodo: (id: any, status: any) =>
    set((state: any) => ({
      todos: state.todos.map((t: any) => (t.id === id ? { ...t, status } : t)),
    })),
}));
