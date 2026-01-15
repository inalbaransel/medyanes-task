// Örn: "http://localhost:3000/api"
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

//postAPI Fonksiyonu: VERİ GÖNDERMEK / DEĞİŞTİRMEK İÇİN

export const postAPI = async (
  endpoint: string, // endpoint: Gideceğimiz oda numarası. String (Yazı) olmalı. Örn: "/todos"
  body: any, // body: Götürdüğümüz koli/paket. Any (Her şey) olabilir. (İçinde başlık, tarih vs. var)
  method = "POST" // method: Nasıl gideceğiz? Varsayılan "POST" (Yeni kayıt). Ama "PUT" veya "DELETE" de olabilir.
) => {
  try {
    // fetch -> Tarayıcıya "Git şu adrese" deme komutu.
    // await -> "Cevap gelene kadar bekle, acele etme" demek.
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: method, // Mektubun türü (POST, PUT, DELETE...)

      // headers: Zarfın üzerindeki bilgiler.
      // "Content-Type": "application/json" -> "Kardeşim ben sana JSON (Yazı formatında veri) gönderiyorum" diyoruz.
      headers: { "Content-Type": "application/json" },

      // body: Koliyi paketliyoruz.
      // JSON.stringify(body) -> Javascript objesini, internetten gidebilsin diye "Yazıya (String)" çeviriyoruz.
      body: JSON.stringify(body),

      // cache: "no-store" -> "Sakın hafızana atma, her seferinde taze veri getir/götür" diyoruz.
      cache: "no-store",
    });

    // !res.ok -> "Cevap OK değilse" demek.
    // res.ok: İşlem başarılı mı? (200-299 arası kodlar).
    if (!res.ok) {
      throw new Error("İşlem başarısız oldu");
    }

    // res.json() -> Gelen cevabı (yazıyı) tekrar bizim anlayacağımız Obje'ye çevir.
    return res.json();
  } catch (err) {
    console.log("Post API Hatası:", err);

    return null;
  }
};

//getAPI Fonksiyonu: VERİ OKUMAK / LİSTELEMEK İÇİN

export const getAPI = async (endpoint: string) => {
  // Sadece oda numarasını (endpoint) bilmesi yeterli.
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET", // GET: "Sadece alıp geleceğim, bir şey bırakmayacağım"
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // Taze veri olsun
    });

    if (!res.ok) {
      // Cevap başarılı değilse (Örn: 404 Sayfa bulunamadı)
      throw new Error("Veri çekilemedi");
    }

    return res.json(); // Veriyi paketten çıkar
  } catch (err) {
    console.log("Get API Hatası:", err);
    // Eğer veriyi çekemezsek "Boş Liste []" dönelim ki,
    // ekranda .map() yaparken "Undefined hatası" almayalım.
    return [];
  }
};
