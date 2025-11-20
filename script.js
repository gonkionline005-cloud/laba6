// Ждем полной загрузки DOM-дерева
document.addEventListener('DOMContentLoaded', () => {

    // =====================================
    // БЛОК 1: Переключатель темы с localStorage
    // =====================================
    const THEME_KEY = 'user-theme';
    const themeSwitcher = document.getElementById('theme-switcher');

    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }

    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark'; 
    applyTheme(savedTheme);

    themeSwitcher?.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        let newTheme = isLight ? 'dark' : 'light';
        
        applyTheme(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
    });


    // =====================================
    // БЛОК 2: Отзывы (Один блок, API: dummyjson.com)
    // =====================================
    const reviewsContainer = document.getElementById('reviews-container');
    const reloadReviewsBtn = document.getElementById('reload-reviews-btn'); 
    const QUOTE_API_URL = 'https://dummyjson.com/quotes/random';

    // Вспомогательная функция для задержки (для лучшей видимости "Загрузка...")
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function loadReview() {
        if (!reviewsContainer) return;

        // 1. Показываем статус загрузки
        reviewsContainer.innerHTML = "Загрузка...";
        
        // Добавляем искусственную задержку (0.5 сек), чтобы статус был виден
        await delay(500); 

        try {
            const res = await fetch(QUOTE_API_URL);
            
            if (!res.ok) {
                // Если API ответило ошибкой, выбрасываем исключение
                throw new Error(`Ошибка HTTP: ${res.status}`);
            }
            
            const data = await res.json();

            // 2. Вставляем HTML с цитатой и автором
            reviewsContainer.innerHTML = `
                <p><i>"${data.quote}"</i></p>
                <footer>— ${data.author}</footer>
            `;
        } catch (error) {
            console.error("Ошибка загрузки отзыва:", error);
            // 3. Показываем ошибку
            reviewsContainer.innerHTML = "Ошибка загрузки отзыва. Попробуйте снова или проверьте подключение.";
        }
    }

    // Обработчик для кнопки "Обновить отзыв"
    reloadReviewsBtn?.addEventListener('click', loadReview);

    // Вызываем загрузку при старте
    loadReview();


    // =====================================
    // БЛОК 3: Галерея (Picsum.photos)
    // =====================================
    const imagesContainer = document.getElementById('images-container');
    const reloadGalleryBtn = document.getElementById('reload-gallery-btn');
    const IMAGE_COUNT = 6;
    const IMAGE_SIZE = '300/300'; 

    function createPlaceholder() {
        const item = document.createElement('div');
        item.className = 'gallery-item loading';
        item.innerHTML = '<img src="" alt="Загрузка изображения..." style="opacity: 0;"/>'; 
        return item;
    }

    function loadGalleryImages() {
        if (!imagesContainer) return;
        
        imagesContainer.innerHTML = ''; 
        const placeholders = [];

        for (let i = 0; i < IMAGE_COUNT; i++) {
            const placeholder = createPlaceholder();
            imagesContainer.appendChild(placeholder);
            placeholders.push(placeholder);
        }

        placeholders.forEach((placeholder, i) => {
            const imageUrl = `https://picsum.photos/${IMAGE_SIZE}?random=${Date.now() + i}`; 
            
            const imgElement = placeholder.querySelector('img');
            
            imgElement.onload = () => {
                 placeholder.classList.remove('loading');
                 imgElement.style.opacity = '1';
                 placeholder.alt = "Случайное изображение";

                 placeholder.addEventListener('click', function() {
                    const modal = document.getElementById("imageModal");
                    const modalImg = document.getElementById("modalImage");
                    modal.style.display = "block";
                    modalImg.src = imgElement.src; 
                    modalImg.alt = imgElement.alt;
                });
            };
            
            imgElement.onerror = () => {
                placeholder.classList.remove('loading');
                placeholder.alt = "Ошибка загрузки";
                placeholder.innerHTML = '<p style="color: red; padding: 10px;">Ошибка загрузки</p>';
            };

            imgElement.src = imageUrl; 
        });
    }

    reloadGalleryBtn?.addEventListener('click', loadGalleryImages);
    loadGalleryImages(); 


    // =====================================
    // БЛОК 4: Функции из ЛР №5 (Аккордеон, Наверх, Модальное окно)
    // =====================================
    
    // Кнопка "Наверх" 
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    });

    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    // Аккордеон
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', function() {
            const currentItem = this.parentNode;
            const isActive = currentItem.classList.contains('active');

            document.querySelectorAll('.accordion-item.active').forEach(item => {
                item.classList.remove('active');
            });

            if (!isActive) {
                currentItem.classList.add('active');
            }
        });
    });


    // Модальное окно с увеличением фото
    const modal = document.getElementById("imageModal");
    const closeBtn = document.querySelector(".modal .close-btn");

    closeBtn.addEventListener('click', function() {
        modal.style.display = "none";
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

});