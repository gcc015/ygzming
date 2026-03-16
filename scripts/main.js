/**
 * Lumina户外景观灯 - 交互脚本
 * 功能：移动端菜单切换、Excel下载
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

/**
 * 获取技术参数数据
 */
function getSpecsData() {
  return [
    ['参数项', '路径灯', '壁灯', '地埋灯', '柱灯', '庭院灯', '草坪灯', '投光灯', '氛围灯'],
    ['额定电压', 'AC 220-240V', 'AC 220-240V', 'AC/DC 12V', 'AC 220-240V', 'AC 220-240V', 'DC 12V/24V', 'AC 220-240V', 'DC 12V'],
    ['功率', '15W', '20W', '5W', '25W', '30W', '8W', '50W', '6W'],
    ['色温', '3000K 暖白', '2700K-6500K 可调', '3000K 暖白', '3000K 暖白', '3000K 暖白', '3000K 暖白', '4000K 正白', 'RGB+3000K'],
    ['光通量', '1500lm', '2000lm', '500lm', '2500lm', '3000lm', '800lm', '5000lm', '600lm'],
    ['材质', '铝合金+钢化玻璃', '铝合金', '不锈钢304', '铝合金+玻璃', '铸铝+玻璃', '铝合金', '压铸铝', 'PC+铝合金'],
    ['防护等级', 'IP65', 'IP66', 'IP67', 'IP65', 'IP65', 'IP66', 'IP67', 'IP65'],
    ['工作温度', '-20°C ~ +50°C', '-20°C ~ +50°C', '-30°C ~ +60°C', '-20°C ~ +50°C', '-20°C ~ +50°C', '-30°C ~ +50°C', '-30°C ~ +60°C', '-20°C ~ +45°C'],
    ['寿命', '50000h', '60000h', '50000h', '50000h', '50000h', '40000h', '50000h', '30000h'],
    ['保修期', '5年', '5年', '5年', '5年', '5年', '3年', '5年', '2年']
  ];
}

/**
 * 将数据转换为CSV格式
 */
function dataToCSV(data) {
  return data.map(row => 
    row.map(cell => {
      // 处理包含逗号或引号的单元格
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return '"' + cell.replace(/"/g, '""') + '"';
      }
      return cell;
    }).join(',')
  ).join('\n');
}

/**
 * 下载文件（通用方法）
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType + ';charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * 下载技术参数表为Excel文件
 * 挂载到window对象确保全局可访问
 */
window.downloadExcel = function() {
  const data = getSpecsData();
  
  // 检查SheetJS是否加载
  if (typeof XLSX !== 'undefined') {
    try {
      // 创建工作簿和工作表
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);

      // 设置列宽
      ws['!cols'] = [
        { wch: 12 },  // 参数项
        { wch: 18 },  // 路径灯
        { wch: 18 },  // 壁灯
        { wch: 15 },  // 地埋灯
        { wch: 18 },  // 柱灯
        { wch: 18 },  // 庭院灯
        { wch: 15 },  // 草坪灯
        { wch: 15 },  // 投光灯
        { wch: 15 }   // 氛围灯
      ];

      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, '技术参数');

      // 下载Excel文件
      XLSX.writeFile(wb, 'Lumina户外景观灯_技术参数表.xlsx');
      
      console.log('✅ Excel文件下载成功');
      return;
    } catch (error) {
      console.error('Excel导出失败，尝试CSV格式:', error);
    }
  }
  
  // 备用方案：下载CSV格式
  try {
    const csvContent = '\uFEFF' + dataToCSV(data); // 添加BOM以支持中文
    downloadFile(csvContent, 'Lumina户外景观灯_技术参数表.csv', 'text/csv');
    console.log('✅ CSV文件下载成功');
  } catch (error) {
    alert('下载失败：' + error.message);
    console.error('下载错误:', error);
  }
};
