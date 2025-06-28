// Maingrace247 - Blog Functionality

(function() {
    'use strict';

    // Blog configuration
    const BLOG_CONFIG = {
        articlesPerPage: 6,
        searchDelay: 300,
        animationDuration: 300
    };

    // Initialize blog functionality
    document.addEventListener('DOMContentLoaded', function() {
        initBlogFilters();
        initSearchFunctionality();
        initLoadMore();
        initNewsletterSignup();
        initArticleInteractions();
    });

    // Initialize category filters
    function initBlogFilters() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const blogGrid = document.getElementById('blog-grid');
        const articles = document.querySelectorAll('.blog-card');

        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.dataset.category;
                
                // Update active button
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter articles
                filterArticles(category, articles);
            });
        });
    }

    // Filter articles by category
    function filterArticles(category, articles) {
        articles.forEach(article => {
            const articleCategory = article.dataset.category;
            const shouldShow = category === 'all' || articleCategory === category;
            
            if (shouldShow) {
                showArticle(article);
            } else {
                hideArticle(article);
            }
        });

        // Update grid layout
        updateGridLayout();
    }

    // Show article with animation
    function showArticle(article) {
        article.style.display = 'block';
        article.style.opacity = '0';
        article.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            article.style.transition = `opacity ${BLOG_CONFIG.animationDuration}ms ease, transform ${BLOG_CONFIG.animationDuration}ms ease`;
            article.style.opacity = '1';
            article.style.transform = 'translateY(0)';
        }, 50);
    }

    // Hide article with animation
    function hideArticle(article) {
        article.style.transition = `opacity ${BLOG_CONFIG.animationDuration}ms ease, transform ${BLOG_CONFIG.animationDuration}ms ease`;
        article.style.opacity = '0';
        article.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            article.style.display = 'none';
        }, BLOG_CONFIG.animationDuration);
    }

    // Update grid layout after filtering
    function updateGridLayout() {
        const visibleArticles = document.querySelectorAll('.blog-card[style*="display: block"], .blog-card:not([style*="display: none"])');
        const grid = document.getElementById('blog-grid');
        
        if (visibleArticles.length === 0) {
            showNoResults();
        } else {
            hideNoResults();
        }
    }

    // Show no results message
    function showNoResults() {
        let noResults = document.getElementById('no-results');
        
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.id = 'no-results';
            noResults.className = 'col-span-full text-center py-12';
            noResults.innerHTML = `
                <div class="space-y-4">
                    <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"></path>
                    </svg>
                    <h3 class="font-lora text-xl font-semibold text-gray-900">No articles found</h3>
                    <p class="text-gray-600">Try selecting a different category or search for something else.</p>
                </div>
            `;
            document.getElementById('blog-grid').appendChild(noResults);
        }
        
        noResults.style.display = 'block';
    }

    // Hide no results message
    function hideNoResults() {
        const noResults = document.getElementById('no-results');
        if (noResults) {
            noResults.style.display = 'none';
        }
    }

    // Initialize search functionality
    function initSearchFunctionality() {
        const searchInput = document.getElementById('blog-search');
        if (!searchInput) return;

        let searchTimeout;

        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                const query = this.value.toLowerCase().trim();
                searchArticles(query);
            }, BLOG_CONFIG.searchDelay);
        });

        // Add search input to DOM if it doesn't exist
        if (!searchInput) {
            addSearchInput();
        }
    }

    // Add search input to the page
    function addSearchInput() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'max-w-md mx-auto mb-8';
        searchContainer.innerHTML = `
            <div class="relative">
                <input type="text" 
                       id="blog-search" 
                       placeholder="Search articles..." 
                       class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>
        `;

        const categoriesSection = document.querySelector('.flex.flex-wrap.justify-center.gap-4');
        if (categoriesSection) {
            categoriesSection.parentNode.insertBefore(searchContainer, categoriesSection);
        }
    }

    // Search articles
    function searchArticles(query) {
        const articles = document.querySelectorAll('.blog-card');
        const categoryButtons = document.querySelectorAll('.category-btn');
        
        // Reset category filter
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        categoryButtons[0].classList.add('active'); // "All Articles" button

        if (!query) {
            // Show all articles
            articles.forEach(article => showArticle(article));
            return;
        }

        articles.forEach(article => {
            const title = article.querySelector('h3 a').textContent.toLowerCase();
            const excerpt = article.querySelector('p').textContent.toLowerCase();
            const category = article.querySelector('.absolute span').textContent.toLowerCase();
            
            const matches = title.includes(query) || 
                           excerpt.includes(query) || 
                           category.includes(query);
            
            if (matches) {
                showArticle(article);
            } else {
                hideArticle(article);
            }
        });

        updateGridLayout();
    }

    // Initialize load more functionality
    function initLoadMore() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;

        loadMoreBtn.addEventListener('click', function() {
            loadMoreArticles();
        });
    }

    // Load more articles
    function loadMoreArticles() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        const currentArticles = document.querySelectorAll('.blog-card');
        
        // Show loading state
        loadMoreBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
        `;
        loadMoreBtn.disabled = true;

        // Simulate loading delay
        setTimeout(() => {
            // Add more articles (in a real app, this would fetch from an API)
            addMoreArticles();
            
            // Reset button
            loadMoreBtn.innerHTML = 'Load More Articles';
            loadMoreBtn.disabled = false;
        }, 1500);
    }

    // Add more articles to the grid
    function addMoreArticles() {
        const blogGrid = document.getElementById('blog-grid');
        const newArticles = [
            {
                category: 'wellness-tips',
                categoryName: 'Wellness Tips',
                categoryColor: 'bg-blue-100 text-blue-700',
                image: 'images/blog/meditation-techniques.webp',
                date: 'November 25, 2024',
                readTime: '4 min read',
                title: 'Daily Meditation: Simple Techniques for Beginners',
                excerpt: 'Start your meditation journey with these easy-to-follow techniques that can be practiced anywhere, anytime.',
                imageAlt: 'Meditation Techniques'
            },
            {
                category: 'herbal-remedies',
                categoryName: 'Herbal Remedies',
                categoryColor: 'bg-green-100 text-green-700',
                image: 'images/blog/digestive-herbs.webp',
                date: 'November 22, 2024',
                readTime: '6 min read',
                title: 'Natural Digestive Health: Herbs for Better Digestion',
                excerpt: 'Discover herbs that naturally support digestive health and help maintain a healthy gut microbiome.',
                imageAlt: 'Digestive Herbs'
            },
            {
                category: 'traditional-medicine',
                categoryName: 'Traditional Medicine',
                categoryColor: 'bg-purple-100 text-purple-700',
                image: 'images/blog/healing-rituals.webp',
                date: 'November 20, 2024',
                readTime: '8 min read',
                title: 'Ancient Healing Rituals: Connecting Mind, Body, and Spirit',
                excerpt: 'Explore traditional healing rituals that promote holistic wellness and spiritual connection.',
                imageAlt: 'Healing Rituals'
            }
        ];

        newArticles.forEach(article => {
            const articleElement = createArticleElement(article);
            blogGrid.appendChild(articleElement);
            
            // Add animation
            articleElement.style.opacity = '0';
            articleElement.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                articleElement.style.transition = `opacity ${BLOG_CONFIG.animationDuration}ms ease, transform ${BLOG_CONFIG.animationDuration}ms ease`;
                articleElement.style.opacity = '1';
                articleElement.style.transform = 'translateY(0)';
            }, 100);
        });
    }

    // Create article element
    function createArticleElement(articleData) {
        const article = document.createElement('article');
        article.className = 'blog-card';
        article.dataset.category = articleData.category;
        
        article.innerHTML = `
            <div class="relative overflow-hidden rounded-2xl mb-6">
                <img src="${articleData.image}" alt="${articleData.imageAlt}" class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105">
                <div class="absolute top-4 left-4">
                    <span class="px-3 py-1 ${articleData.categoryColor} rounded-full text-sm font-medium">${articleData.categoryName}</span>
                </div>
            </div>
            <div class="space-y-4">
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span>${articleData.date}</span>
                    <span>•</span>
                    <span>${articleData.readTime}</span>
                </div>
                <h3 class="font-lora text-xl font-semibold text-gray-900 hover:text-green-700 transition-colors">
                    <a href="#">${articleData.title}</a>
                </h3>
                <p class="text-gray-600 leading-relaxed">
                    ${articleData.excerpt}
                </p>
                <a href="#" class="text-green-700 font-medium hover:text-green-800 transition-colors">Read More →</a>
            </div>
        `;

        return article;
    }

    // Initialize newsletter signup
    function initNewsletterSignup() {
        const newsletterForm = document.querySelector('form');
        if (!newsletterForm) return;

        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                subscribeToNewsletter(email);
            }
        });
    }

    // Subscribe to newsletter
    function subscribeToNewsletter(email) {
        const form = document.querySelector('form');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Subscribing...
        `;
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            showNewsletterSuccess();
            
            // Reset form
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    // Show newsletter success message
    function showNewsletterSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        successMessage.innerHTML = `
            <div class="flex items-center space-x-3">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Successfully subscribed to newsletter!</span>
            </div>
        `;

        document.body.appendChild(successMessage);

        // Animate in
        setTimeout(() => {
            successMessage.classList.remove('translate-x-full');
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            successMessage.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 300);
        }, 5000);
    }

    // Initialize article interactions
    function initArticleInteractions() {
        // Add reading time estimation
        estimateReadingTimes();
        
        // Add share functionality
        addShareButtons();
        
        // Add bookmark functionality
        addBookmarkButtons();
    }

    // Estimate reading times
    function estimateReadingTimes() {
        const articles = document.querySelectorAll('.blog-card');
        
        articles.forEach(article => {
            const text = article.querySelector('p').textContent;
            const wordCount = text.split(' ').length;
            const readingTime = Math.ceil(wordCount / 200); // Average reading speed
            
            const timeElement = article.querySelector('.flex.items-center.space-x-4 span:last-child');
            if (timeElement) {
                timeElement.textContent = `${readingTime} min read`;
            }
        });
    }

    // Add share buttons
    function addShareButtons() {
        const articles = document.querySelectorAll('.blog-card');
        
        articles.forEach(article => {
            const shareBtn = document.createElement('button');
            shareBtn.className = 'text-gray-400 hover:text-green-600 transition-colors ml-4';
            shareBtn.innerHTML = `
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                </svg>
            `;
            
            shareBtn.addEventListener('click', function() {
                shareArticle(article);
            });
            
            const readMoreLink = article.querySelector('a[href="#"]:last-child');
            if (readMoreLink) {
                readMoreLink.parentNode.insertBefore(shareBtn, readMoreLink.nextSibling);
            }
        });
    }

    // Share article
    function shareArticle(article) {
        const title = article.querySelector('h3 a').textContent;
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${title}\n${url}`).then(() => {
                showToast('Link copied to clipboard!');
            });
        }
    }

    // Add bookmark buttons
    function addBookmarkButtons() {
        const articles = document.querySelectorAll('.blog-card');
        
        articles.forEach(article => {
            const bookmarkBtn = document.createElement('button');
            bookmarkBtn.className = 'text-gray-400 hover:text-green-600 transition-colors ml-2';
            bookmarkBtn.innerHTML = `
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>
            `;
            
            bookmarkBtn.addEventListener('click', function() {
                toggleBookmark(article, bookmarkBtn);
            });
            
            const shareBtn = article.querySelector('button');
            if (shareBtn) {
                shareBtn.parentNode.insertBefore(bookmarkBtn, shareBtn.nextSibling);
            }
        });
    }

    // Toggle bookmark
    function toggleBookmark(article, button) {
        const isBookmarked = button.classList.contains('text-green-600');
        
        if (isBookmarked) {
            button.classList.remove('text-green-600');
            button.classList.add('text-gray-400');
            showToast('Removed from bookmarks');
        } else {
            button.classList.remove('text-gray-400');
            button.classList.add('text-green-600');
            showToast('Added to bookmarks');
        }
    }

    // Show toast message
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-y-full transition-transform duration-300';
        toast.textContent = message;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-y-full');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-y-full');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Export functions for external use
    window.Maingrace247 = window.Maingrace247 || {};
    window.Maingrace247.Blog = {
        filterByCategory: filterArticles,
        search: searchArticles,
        loadMore: loadMoreArticles,
        subscribe: subscribeToNewsletter
    };

})(); 