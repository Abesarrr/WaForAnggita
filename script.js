// Update time and date dynamically
function updateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = now.toLocaleDateString('en-GB', options);
    
    document.getElementById('current-time').textContent = time;
    document.getElementById('current-date').textContent = date;
}

// Memperbarui waktu setiap detik
setInterval(updateTime, 1000);

// Pesan-pesan yang akan muncul secara berurutan
const messages = [
    "selamat pagii sayaangku 🫶🏻",
    "sayang, semangat ya untuk hari ini 😚",
    "jangan lupa sarapan yaa sayaangku, ayang butuh energi untuk menjalani  hari ini 💪",
    "semoga harinya menyenangkan ya sayaang, mas sayaaaaang banget sama ayaaang 🫰🏻",
    "maafin mas ya sayang kalo mas ada salah atau bikin ayang ga mood 😔", 
    "I LOVE YOU SAYANG 💕",
];

let currentMessageIndex = 0;
let iOSNotificationClicked = false
let typingInProgress = false; // Menandakan apakah sedang mengetik

// Fungsi untuk menampilkan teks seperti sedang mengetik
function typeMessage(message) {
    const messageText = document.getElementById('message-text');
    let i = 0;
    messageText.textContent = ''; // Reset text untuk memulai dari kosong
    typingInProgress = true; // Tandai bahwa mengetik sedang berlangsung

    function typeWriter() {
        if (i < message.length) {
            messageText.textContent += message.charAt(i); // Tambahkan satu huruf
            i++;
            setTimeout(typeWriter, 110); // Waktu jeda antara huruf (50ms)
            document.getElementById('next-message-btn').style.display = 'none';
        } else {
            typingInProgress = false; // Tandai bahwa mengetik selesai
            document.getElementById('next-message-btn').style.display = 'block'; // Tampilkan tombol setelah selesai mengetik
        }
    }

    typeWriter(); // Panggil fungsi mengetik
}

// Fungsi untuk membuka popup
function openPopup() {
    document.getElementById('popup').classList.remove('hidden');
}

// Fungsi untuk menutup popup
function closePopup() {
    document.getElementById('popup').classList.add('hidden');
}

// Event listener untuk iOS notification
document.getElementById('ios-notification').addEventListener('click', function() {
    iOSNotificationClicked = true;
    this.style.display = 'none'; // Sembunyikan iOS notification setelah diklik
    
    // Tampilkan WhatsApp notification dan pesan pertama
    const whatsappNotification = document.getElementById('whatsapp-notification');
    whatsappNotification.classList.add('show');
    typeMessage(messages[currentMessageIndex]);
});

// Tampilkan pesan selanjutnya ketika tombol ditekan
document.getElementById('next-message-btn').addEventListener('click', function () {
    if (!iOSNotificationClicked) return;
    
    const notification = document.getElementById('whatsapp-notification');
    const nextMessageBtn = document.getElementById('next-message-btn');

    // Sembunyikan tombol jika sedang mengetik
    if (typingInProgress) {
        nextMessageBtn.style.display = 'none'; // Sembunyikan tombol
        return; // Keluarkan dari fungsi
    }

    // Jika sudah di pesan terakhir, buka popup untuk kirim pesan
    if (currentMessageIndex === messages.length - 1) {
        openPopup();
    } else {
        // Sembunyikan notifikasi agar bisa direset
        notification.classList.remove('show'); // Ganti 'visible' dengan 'show'

        // Tunggu sedikit sebelum menampilkan pesan baru (untuk efek transisi keluar masuk)
        setTimeout(() => {
            // Set pesan baru
            currentMessageIndex++;
            if (currentMessageIndex === messages.length - 1) {
                // Jika pesan terakhir, ubah tombol menjadi "Kirim Pesan"
                nextMessageBtn.textContent = "Kirim Pesan";
            } else {
                // Reset teks tombol ke "Pesan Selanjutnya"
                nextMessageBtn.textContent = "Pesan Selanjutnya";
            }

            // Tampilkan pesan baru dengan animasi mengetik
            typeMessage(messages[currentMessageIndex]);

            // Tampilkan notifikasi dengan animasi
            notification.classList.add('show'); // Ganti 'visible' dengan 'show'
        }, 500); // Waktu untuk efek keluar masuk notifikasi
    }
});

// Event listener untuk menutup popup
document.getElementById('close-popup-btn').addEventListener('click', closePopup);

// Event listener untuk mengirim pesan ke WhatsApp
document.getElementById('send-message-btn').addEventListener('click', function () {
    const message = document.getElementById('custom-message').value;
    
    // Jika pesan tidak kosong, buka WhatsApp dengan pesan tersebut
    if (message.trim() !== '') {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank'); // Buka link WhatsApp
    }
});

// Ambil elemen audio
const backgroundMusic = document.getElementById('background-music');
// Mute audio saat dimuat
backgroundMusic.muted = true;

// Cek preferensi audio dari localStorage
if (localStorage.getItem('audioPreference') === 'enabled') {
    backgroundMusic.muted = false; // Hapus mute jika pengguna sebelumnya memilih untuk memutar
    backgroundMusic.play();
}
// Mulai musik ketika halaman selesai dimuat
window.addEventListener('click', function () {
    backgroundMusic.muted = false; // Hapus mute
    backgroundMusic.play().catch(error => {
        console.log("Musik tidak dapat diputar otomatis. Silakan aktifkan suara di browser.");
    });
});

// Tambahkan kontrol untuk tombol play/pause
const playPauseButton = document.getElementById('play-pause-button');

playPauseButton.addEventListener('click', function () {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        playPauseButton.textContent = "Jeda Musik"; // Ubah teks tombol
    } else {
        backgroundMusic.pause();
        playPauseButton.textContent = "Putar Musik"; // Ubah teks tombol
    }
});