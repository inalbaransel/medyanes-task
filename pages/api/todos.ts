import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Veritabanına bağlanan anahtarımız.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //LİSTELEME İŞLEMİ (GET)
  if (req.method === "GET") {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" }, // En yeniler en üstte olsun (desc: azalan)
    });
    // Bulduklarımızı JSON paketi yapıp geri gönderiyoruz.
    res.json(todos);
  }

  //EKLEME İŞLEMİ (POST)
  // "Yeni bir görev kaydet" dendiğinde burası çalışır.
  else if (req.method === "POST") {
    // req.body: Bize gönderilen paketin içi.
    const { title, description } = req.body;

    // Veritabanına diyoruz ki: "Todo tablosunda yeni bir satır oluştur."
    const newTodo = await prisma.todo.create({
      data: {
        title: title,
        description: description,
      },
    });
    // Oluşturduğumuz yeni kaydı geri gönderiyoruz
    res.json(newTodo);
  }

  // GÜNCELLEME İŞLEMİ (PUT)
  // Şu görevi değiştirdim dendiğinde burası çalışır.
  else if (req.method === "PUT") {
    const { id, status, title, description } = req.body; // Paket içinden bilgileri al.

    // Veritabanına diyoruz ki: "Şu ID'ye sahip satırı bul ve güncelle."
    const updated = await prisma.todo.update({
      where: { id: id }, // Kimi? -> ID'si bu olanı.
      data: {
        status: status,
        title: title, // Yeni başlık (varsa)
        description: description, // Yeni açıklama (varsa)
      },
    });

    res.json(updated);
  }

  // SİLME İŞLEMİ (DELETE)
  // Bunu sil dendiğinde burası çalışır.
  else if (req.method === "DELETE") {
    const { id } = req.body; // Paket içinden silinecek ID'yi alıyoruz.

    // Veritabanına diyoruz ki: Şu ID'li satırı sil gitsin.
    await prisma.todo.delete({
      where: { id: id },
    });

    res.json({ message: "Silindi" });
  }
}
