/**
 * Lumina户外景观灯 - 交互脚本
 * 功能：移动端菜单切换
 */

(function() {
  'use strict';
  
  // DOM元素
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const headerNav = document.querySelector('.header-nav');
  const ctaButton = document.querySelector('.cta-button');
  
  // 移动端菜单切换
  if (mobileMenuBtn && headerNav) {
    mobileMenuBtn.addEventListener('click', function() {
      headerNav.classList.toggle('active');
      if (ctaButton) {
        ctaButton.classList.toggle('active');
      }
      
      // 更新ARIA属性
      const isExpanded = headerNav.classList.contains('active');
      mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
      mobileMenuBtn.setAttribute('aria-label', isExpanded ? '关闭菜单' : '菜单');
    });
  }
  
  // 点击导航链接后关闭菜单（移动端）
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        headerNav.classList.remove('active');
        if (ctaButton) {
          ctaButton.classList.remove('active');
        }
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', '菜单');
      }
    });
  });
  
  // 点击页面其他区域关闭菜单
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768 && 
        headerNav && 
        headerNav.classList.contains('active') &&
        !headerNav.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
      headerNav.classList.remove('active');
      if (ctaButton) {
        ctaButton.classList.remove('active');
      }
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.setAttribute('aria-label', '菜单');
    }
  });
  
  // 平滑滚动增强（兼容性处理）
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // 计算目标位置（考虑固定导航栏高度）
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // 性能优化：图片懒加载（如果浏览器支持）
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }
  
  // 控制台欢迎信息
  console.log('%c🌟 Lumina户外景观灯', 'font-size: 20px; font-weight: bold; color: #007BFF;');
  console.log('%c专业户外照明解决方案', 'font-size: 14px; color: #666;');
})();
