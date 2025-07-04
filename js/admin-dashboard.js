// Maingrace247 - Admin Dashboard

(function() {
    'use strict';

    // Data storage keys
    const BLOGS_STORAGE_KEY = 'maingrace247_blogs';
    const CATEGORIES_STORAGE_KEY = 'maingrace247_categories';
    const SETTINGS_STORAGE_KEY = 'maingrace247_settings';

    // Global variables
    let blogs = [];
    let categories = [];
    let settings = {};
    let currentEditId = null;
    let deleteItemId = null;
    let deleteItemType = null;

    // Initialize dashboard
    document.addEventListener('DOMContentLoaded', function() {
        if (!validateAdminSession()) {
            return;
        }

        loadData();
        initNavigation();
        initEventListeners();
        updateAdminInfo();
        loadDashboard();
    });

    // Load data from storage
    function loadData() {
        // Load blogs
        const storedBlogs = localStorage.getItem(BLOGS_STORAGE_KEY);
        if (storedBlogs) {
            blogs = JSON.parse(storedBlogs);
        } else {
            loadBlogsFromFile();
        }

        // Load categories
        const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
        if (storedCategories) {
            categories = JSON.parse(storedCategories);
        } else {
            loadCategoriesFromFile();
        }

        // Load settings
        const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings) {
            settings = JSON.parse(storedSettings);
        } else {
            settings = {
                postsPerPage: 6,
                allowComments: true,
                autoSave: true
            };
        }
    }

    // Load blogs from JSON file
    async function loadBlogsFromFile() {
        try {
            const response = await fetch('data/blogs.json');
            const data = await response.json();
            blogs = data.blogs || [];
            categories = data.categories || [];
            settings = data.settings || {
                postsPerPage: 6,
                allowComments: true,
                autoSave: true
            };
            saveData();
        } catch (error) {
            console.error('Error loading blogs from file:', error);
            blogs = [];
            categories = [];
        }
    }

    // Load categories from JSON file
    async function loadCategoriesFromFile() {
        try {
            const response = await fetch('data/blogs.json');
            const data = await response.json();
            categories = data.categories || [];
        } catch (error) {
            console.error('Error loading categories from file:', error);
            categories = [];
        }
    }

    // Save data to localStorage
    function saveData() {
        localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(blogs));
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }

    // Initialize navigation
    function initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.section');

        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                navItems.forEach(nav => nav.classList.remove('active'));
                sections.forEach(section => section.classList.add('hidden'));

                this.classList.add('active');
                
                const sectionId = this.dataset.section;
                document.getElementById(sectionId).classList.remove('hidden');

                switch(sectionId) {
                    case 'dashboard':
                        loadDashboard();
                        break;
                    case 'blogs':
                        loadBlogs();
                        break;
                    case 'categories':
                        loadCategories();
                        break;
                    case 'settings':
                        loadSettings();
                        break;
                }
            });
        });
    }

    // Initialize event listeners
    function initEventListeners() {
        const searchInput = document.getElementById('searchPosts');
        const statusFilter = document.getElementById('statusFilter');
        const categoryFilter = document.getElementById('categoryFilter');

        if (searchInput) {
            searchInput.addEventListener('input', filterPosts);
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', filterPosts);
        }
        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterPosts);
        }

        const postForm = document.getElementById('postForm');
        const categoryForm = document.getElementById('categoryForm');
        const settingsForm = document.getElementById('settingsForm');

        if (postForm) {
            postForm.addEventListener('submit', handlePostSubmit);
        }
        if (categoryForm) {
            categoryForm.addEventListener('submit', handleCategorySubmit);
        }
        if (settingsForm) {
            settingsForm.addEventListener('submit', handleSettingsSubmit);
        }
    }

    // Update admin info
    function updateAdminInfo() {
        const admin = getCurrentAdmin();
        if (admin) {
            const adminName = document.getElementById('adminName');
            if (adminName) {
                adminName.textContent = admin.username;
            }
        }
    }

    // Load dashboard
    function loadDashboard() {
        updateStats();
        loadRecentPosts();
    }

    // Update statistics
    function updateStats() {
        const totalPosts = blogs.length;
        const publishedPosts = blogs.filter(blog => blog.status === 'published').length;
        const draftPosts = blogs.filter(blog => blog.status === 'draft').length;
        const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);

        document.getElementById('totalPosts').textContent = totalPosts;
        document.getElementById('publishedPosts').textContent = publishedPosts;
        document.getElementById('draftPosts').textContent = draftPosts;
        document.getElementById('totalViews').textContent = totalViews.toLocaleString();
    }

    // Load recent posts
    function loadRecentPosts() {
        const recentPostsContainer = document.getElementById('recentPosts');
        if (!recentPostsContainer) return;

        const recentPosts = blogs
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5);

        recentPostsContainer.innerHTML = recentPosts.length > 0 ? 
            recentPosts.map(post => `
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-900">${post.title}</h4>
                        <p class="text-sm text-gray-500">${post.excerpt}</p>
                        <div class="flex items-center space-x-4 mt-2">
                            <span class="text-xs text-gray-400">${formatDate(post.updatedAt)}</span>
                            <span class="text-xs px-2 py-1 rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">${post.status}</span>
                            <span class="text-xs text-gray-400">${post.views || 0} views</span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="editPost('${post.id}')" class="text-blue-600 hover:text-blue-800">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button onclick="deletePost('${post.id}')" class="text-red-600 hover:text-red-800">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('') : 
            '<p class="text-gray-500 text-center py-8">No posts yet. Create your first post!</p>';
    }

    // Load blogs
    function loadBlogs() {
        populateCategoryFilter();
        renderPostsTable();
    }

    // Populate category filter
    function populateCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        const postCategory = document.getElementById('postCategory');
        
        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">All Categories</option>' +
                categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
        }
        
        if (postCategory) {
            postCategory.innerHTML = '<option value="">Select category</option>' +
                categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
        }
    }

    // Render posts table
    function renderPostsTable() {
        const tableBody = document.getElementById('postsTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = blogs.map(post => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-lg object-cover" src="${post.featuredImage || 'images/maingrace-hhd.webp'}" alt="${post.title}">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${post.title}</div>
                            <div class="text-sm text-gray-500">${post.excerpt.substring(0, 60)}...</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ${getCategoryName(post.category)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                        ${post.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formatDate(post.updatedAt)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${post.views || 0}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                        <button onclick="editPost('${post.id}')" class="text-blue-600 hover:text-blue-900">Edit</button>
                        <button onclick="deletePost('${post.id}')" class="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Load categories
    function loadCategories() {
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (!categoriesGrid) return;

        categoriesGrid.innerHTML = categories.map(category => `
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-medium text-gray-900">${category.name}</h3>
                        <p class="text-sm text-gray-500">${category.description}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="editCategory('${category.id}')" class="text-blue-600 hover:text-blue-800">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button onclick="deleteCategory('${category.id}')" class="text-red-600 hover:text-red-800">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="text-sm text-gray-500">
                    ${getPostsInCategory(category.id)} posts
                </div>
            </div>
        `).join('');
    }

    // Load settings
    function loadSettings() {
        document.getElementById('postsPerPage').value = settings.postsPerPage || 6;
        document.getElementById('allowComments').checked = settings.allowComments || false;
        document.getElementById('autoSave').checked = settings.autoSave || false;
    }

    // Filter posts
    function filterPosts() {
        const searchTerm = document.getElementById('searchPosts').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const categoryFilter = document.getElementById('categoryFilter').value;

        const filteredBlogs = blogs.filter(blog => {
            const matchesSearch = blog.title.toLowerCase().includes(searchTerm) || 
                                 blog.excerpt.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || blog.status === statusFilter;
            const matchesCategory = !categoryFilter || blog.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });

        renderFilteredPosts(filteredBlogs);
    }

    // Render filtered posts
    function renderFilteredPosts(filteredBlogs) {
        const tableBody = document.getElementById('postsTableBody');
        if (!tableBody) return;

        if (filteredBlogs.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                        No posts found matching your criteria
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = filteredBlogs.map(post => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-lg object-cover" src="${post.featuredImage || 'images/maingrace-hhd.webp'}" alt="${post.title}">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${post.title}</div>
                            <div class="text-sm text-gray-500">${post.excerpt.substring(0, 60)}...</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ${getCategoryName(post.category)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                        ${post.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formatDate(post.updatedAt)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${post.views || 0}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                        <button onclick="editPost('${post.id}')" class="text-blue-600 hover:text-blue-900">Edit</button>
                        <button onclick="deletePost('${post.id}')" class="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Handle post form submission
    function handlePostSubmit(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('postTitle').value,
            excerpt: document.getElementById('postExcerpt').value,
            content: document.getElementById('postContent').value,
            category: document.getElementById('postCategory').value,
            tags: document.getElementById('postTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            featuredImage: document.getElementById('postImage').value,
            status: document.getElementById('postStatus').value,
            featured: document.getElementById('postFeatured').checked
        };

        if (currentEditId) {
            updatePost(currentEditId, formData);
        } else {
            createPost(formData);
        }
    }

    // Handle category form submission
    function handleCategorySubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('categoryName').value,
            description: document.getElementById('categoryDescription').value
        };

        createCategory(formData);
    }

    // Handle settings form submission
    function handleSettingsSubmit(e) {
        e.preventDefault();
        
        settings = {
            postsPerPage: parseInt(document.getElementById('postsPerPage').value),
            allowComments: document.getElementById('allowComments').checked,
            autoSave: document.getElementById('autoSave').checked
        };

        saveData();
        showToast('Settings saved successfully!', 'success');
    }

    // Create new post
    function createPost(formData) {
        const newPost = {
            id: generateId(),
            slug: generateSlug(formData.title),
            ...formData,
            author: 'Dr. Grace Maina',
            authorImage: 'images/DR-GRACE-MAINGRACE-removebg-preview.png',
            readingTime: calculateReadingTime(formData.content),
            publishedAt: formData.status === 'published' ? new Date().toISOString() : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            views: 0,
            likes: 0
        };

        blogs.unshift(newPost);
        saveData();
        
        closePostModal();
        showToast('Post created successfully!', 'success');
        
        if (document.getElementById('blogs').classList.contains('hidden')) {
            loadDashboard();
        } else {
            loadBlogs();
        }
    }

    // Update existing post
    function updatePost(id, formData) {
        const postIndex = blogs.findIndex(blog => blog.id === id);
        if (postIndex === -1) return;

        const updatedPost = {
            ...blogs[postIndex],
            ...formData,
            slug: generateSlug(formData.title),
            readingTime: calculateReadingTime(formData.content),
            publishedAt: formData.status === 'published' && !blogs[postIndex].publishedAt ? new Date().toISOString() : blogs[postIndex].publishedAt,
            updatedAt: new Date().toISOString()
        };

        blogs[postIndex] = updatedPost;
        saveData();
        
        closePostModal();
        showToast('Post updated successfully!', 'success');
        
        if (document.getElementById('blogs').classList.contains('hidden')) {
            loadDashboard();
        } else {
            loadBlogs();
        }
    }

    // Create new category
    function createCategory(formData) {
        const newCategory = {
            id: generateSlug(formData.name),
            ...formData
        };

        categories.push(newCategory);
        saveData();
        
        closeCategoryModal();
        showToast('Category created successfully!', 'success');
        loadCategories();
        populateCategoryFilter();
    }

    // Utility functions
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    function generateSlug(title) {
        return title.toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    function calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function getCategoryName(categoryId) {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Uncategorized';
    }

    function getPostsInCategory(categoryId) {
        return blogs.filter(blog => blog.category === categoryId).length;
    }

    // Modal functions
    window.showCreatePostModal = function() {
        currentEditId = null;
        document.getElementById('modalTitle').textContent = 'Create New Post';
        document.getElementById('postForm').reset();
        document.getElementById('postModal').classList.remove('hidden');
    };

    window.closePostModal = function() {
        document.getElementById('postModal').classList.add('hidden');
        currentEditId = null;
    };

    window.showCreateCategoryModal = function() {
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryModal').classList.remove('hidden');
    };

    window.closeCategoryModal = function() {
        document.getElementById('categoryModal').classList.add('hidden');
    };

    window.editPost = function(id) {
        const post = blogs.find(blog => blog.id === id);
        if (!post) return;

        currentEditId = id;
        document.getElementById('modalTitle').textContent = 'Edit Post';
        
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postExcerpt').value = post.excerpt;
        document.getElementById('postContent').value = post.content;
        document.getElementById('postCategory').value = post.category;
        document.getElementById('postTags').value = post.tags.join(', ');
        document.getElementById('postImage').value = post.featuredImage || '';
        document.getElementById('postStatus').value = post.status;
        document.getElementById('postFeatured').checked = post.featured || false;
        
        document.getElementById('postModal').classList.remove('hidden');
    };

    window.deletePost = function(id) {
        deleteItemId = id;
        deleteItemType = 'post';
        document.getElementById('deleteMessage').textContent = 'Are you sure you want to delete this post? This action cannot be undone.';
        document.getElementById('deleteModal').classList.remove('hidden');
    };

    window.deleteCategory = function(id) {
        deleteItemId = id;
        deleteItemType = 'category';
        document.getElementById('deleteMessage').textContent = 'Are you sure you want to delete this category? Posts in this category will become uncategorized.';
        document.getElementById('deleteModal').classList.remove('hidden');
    };

    window.closeDeleteModal = function() {
        document.getElementById('deleteModal').classList.add('hidden');
        deleteItemId = null;
        deleteItemType = null;
    };

    window.confirmDelete = function() {
        if (deleteItemType === 'post') {
            blogs = blogs.filter(blog => blog.id !== deleteItemId);
            showToast('Post deleted successfully!', 'success');
        } else if (deleteItemType === 'category') {
            categories = categories.filter(cat => cat.id !== deleteItemId);
            blogs.forEach(blog => {
                if (blog.category === deleteItemId) {
                    blog.category = '';
                }
            });
            showToast('Category deleted successfully!', 'success');
        }
        
        saveData();
        closeDeleteModal();
        
        if (document.getElementById('blogs').classList.contains('hidden')) {
            loadDashboard();
        } else {
            loadBlogs();
        }
        loadCategories();
        populateCategoryFilter();
    };

    // Toast notifications
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        
        const bgColor = type === 'success' ? 'bg-green-500' : 
                       type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        
        toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    }

})();
