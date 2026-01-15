import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Veritabanına bağlanan anahtarımız.

// --------------------------------------------------------------------------------------
// BACKEND (SUNUCU) TARAFI - GARSON
// Frontend'den (Müşteri) gelen siparişleri burada karşılıyoruz.
// --------------------------------------------------------------------------------------
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Gelen isteğin türüne (Method) göre işlem yapıyoruz.
  // req.method: GET mi, POST mu, DELETE mi?

  // 1. LİSTELEME İŞLEMİ (GET)
  // "Bana tüm görevleri getir" dendiğinde burası çalışır.
  if (req.method === "GET") {
    // Veritabanına (Prisma'ya) diyoruz ki: "Todo tablosundaki her şeyi bul getir."
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" }, // En yeniler en üstte olsun (desc: azalan)
    });
    // Bulduklarımızı JSON paketi yapıp geri gönderiyoruz.
    res.json(todos);
  }

  // 2. EKLEME İŞLEMİ (POST)
  // "Yeni bir görev kaydet" dendiğinde burası çalışır.
  else if (req.method === "POST") {
    // req.body: Bize gönderilen paketin içi. (Başlık ve Açıklama var)
    const { title, description } = req.body;

    // Veritabanına diyoruz ki: "Todo tablosunda yeni bir satır oluştur."
    const newTodo = await prisma.todo.create({
      data: {
        title: title,
        description: description,
      },
    });
    // Oluşturduğumuz yeni kaydı geri gönderiyoruz (Başarılı oldu demek için)
    res.json(newTodo);
  }

  // 3. GÜNCELLEME İŞLEMİ (PUT)
  // "Şu görevi değiştirdim" dendiğinde burası çalışır.
  else if (req.method === "PUT") {
    const { id, status } = req.body; // Hangi id'li görev? Yeni durumu ne?

    // Veritabanına diyoruz ki: "Şu ID'ye sahip satırı bul ve güncelle."
    const updated = await prisma.todo.update({
      where: { id: id }, // Kimi? -> ID'si bu olanı.
      data: { status: status }, // Neyi? -> Status'ünü değiştir.
    });

    res.json(updated);
  }

  // 4. SİLME İŞLEMİ (DELETE)
  // "Bunu sil" dendiğinde burası çalışır.
  else if (req.method === "DELETE") {
    const { id } = req.body; // Paket içinden silinecek ID'yi alıyoruz.

    // Veritabanına diyoruz ki: "Şu ID'li satırı sil gitsin."
    await prisma.todo.delete({
      where: { id: id },
    });

    res.json({ message: "Silindi" }); // "Tamam sildim" mesajı dönüyoruz.
  }
}
