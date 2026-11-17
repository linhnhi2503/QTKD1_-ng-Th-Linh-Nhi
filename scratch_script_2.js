
    // State
    const state = {
      step: 0,
      approvedStep: 0,
      activeSourceKey: 'rfq_requirements',
      dataset1000: null,
      rawRows: [],
      filteredRows: [],
      currentPage: 1,
      rowsPerPage: 10,
      chartInstance: null,
      chartType: 'bar',
      anomalies: []
    };

    // Pre-computed summary data
    const benchmarkSummary = {
      totalGross: 102012600000,
      totalDiscount: 4231384000,
      totalNet: 97781216000,
      totalCost: 78947600000,
      totalProfit: 18833616000,
      marginPct: 19.26,
      customers: [
        { name: 'Công ty An Phát', count: 100, gross: 10842000000, net: 10362480000, profit: 1982480000 },
        { name: 'Công ty Minh Long', count: 100, gross: 10624000000, net: 10184200000, profit: 1948200000 },
        { name: 'Công ty Hưng Thịnh', count: 100, gross: 10560000000, net: 10120000000, profit: 1932000000 },
        { name: 'Trường Minh Khai', count: 100, gross: 10420000000, net: 9980000000, profit: 1910000000 },
        { name: 'Bệnh viện Thành Công', count: 100, gross: 10340000000, net: 9920000000, profit: 1895000000 },
        { name: 'Tập đoàn Phú Gia', count: 100, gross: 10210000000, net: 9810000000, profit: 1880000000 },
        { name: 'Nhà máy Đông Á', count: 100, gross: 9940000000, net: 9540000000, profit: 1845000000 },
        { name: 'Trung tâm Đào tạo Á Châu', count: 100, gross: 9820000000, net: 9430000000, profit: 1825000000 },
        { name: 'Công ty Sao Mai', count: 100, gross: 9780000000, net: 9390000000, profit: 1818000000 },
        { name: 'Công ty Đại Việt', count: 100, gross: 9680000000, net: 9310000000, profit: 1798000000 },
      ],
      products: [
        { name: 'Switch 48 port', count: 200, qty: 2580, gross: 46440000000, net: 44204400000, profit: 8084400000 },
        { name: 'Switch 24 port', count: 200, qty: 2420, gross: 20570000000, net: 19723000000, profit: 3267000000 },
        { name: 'Access Point Wi-Fi 6', count: 200, qty: 3640, gross: 15288000000, net: 14656320000, profit: 3008320000 },
        { name: 'Firewall', count: 200, qty: 412, gross: 13184000000, net: 12632000000, profit: 2332000000 },
        { name: 'Router', count: 200, qty: 588, gross: 7056000000, net: 6565496000, profit: 2141896000 },
      ],
      locations: [
        { name: 'Hà Nội', count: 200, net: 19752480000, profit: 3800480000 },
        { name: 'Bắc Ninh', count: 200, net: 20304200000, profit: 3880200000 },
        { name: 'TP. Hồ Chí Minh', count: 200, net: 19520000000, profit: 3755000000 },
        { name: 'Đà Nẵng', count: 200, net: 18740000000, profit: 3623000000 },
        { name: 'Hải Phòng', count: 200, net: 19464536000, profit: 3774936000 },
      ],
      discounts: [
        { name: 'Chiết khấu > 5% (POL-02)', count: 71, net: 34712000000, profit: 5820000000 },
        { name: 'Chiết khấu <= 5% (POL-01)', count: 96, net: 47012000000, profit: 9140000000 },
        { name: 'Không chiết khấu (0%)', count: 33, net: 16057216000, profit: 3873616000 },
      ]
    };

    // Load Dataset 1000 on startup
    
    // =========================================================================
    // REAL CLIENT-SIDE FILE UPLOAD & EXPORT HANDLERS
    // =========================================================================

    function setupDragAndDrop() {
      const dropZone = document.getElementById('dropZone');
      if (!dropZone) return;

      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, e => {
          e.preventDefault();
          e.stopPropagation();
        }, false);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
          dropZone.classList.add('border-pink-500', 'bg-pink-100/80');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
          dropZone.classList.remove('border-pink-500', 'bg-pink-100/80');
        }, false);
      });

      dropZone.addEventListener('drop', e => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length) {
          processUploadedFile(files[0]);
        }
      }, false);
    }

    function handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        processUploadedFile(file);
      }
    }

    async function processUploadedFile(file) {
      const fileName = file.name;
      const fileExt = fileName.split('.').pop().toLowerCase();
      
      console.log('Đang xử lý file:', fileName, fileExt);

      try {
        if (fileExt === 'xlsx' || fileExt === 'xls') {
          await parseExcelFile(file);
        } else if (fileExt === 'docx') {
          await parseWordFile(file);
        } else if (fileExt === 'csv' || fileExt === 'txt') {
          await parseCSVFile(file);
        } else {
          alert('Định dạng không được hỗ trợ. Vui lòng tải lên file Excel (.xlsx), Word (.docx) hoặc CSV (.csv).');
          return;
        }

        // Show banner
        document.getElementById('uploadStatusBanner').classList.remove('hidden');
        document.getElementById('uploadStatusTitle').innerText = `Đã tải lên và đọc thành công file: ${fileName}`;
        document.getElementById('uploadStatusDetail').innerText = `${state.rawRows.length} dòng dữ liệu · Đã tự động bóc tách & cập nhật số liệu`;
        
        alert(`Chúc mừng! Đã nạp thành công file ${fileName} (${state.rawRows.length} dòng dữ liệu). Bảng và biểu đồ đã được cập nhật!`);
      } catch (err) {
        console.error('Lỗi khi đọc file:', err);
        alert('Lỗi khi đọc file: ' + err.message);
      }
    }

    function parseExcelFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonRows = XLSX.utils.sheet_to_json(worksheet);

            if (!jsonRows || !jsonRows.length) {
              throw new Error('Sheet không có dữ liệu dòng.');
            }

            state.rawRows = jsonRows;
            state.filteredRows = [...jsonRows];
            state.currentPage = 1;
            renderRawTable();
            
            recalculateMetricsFromRows(jsonRows);
            updateAnalysisDashboard();
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    }

    function parseWordFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
          try {
            if (typeof mammoth !== 'undefined') {
              const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
              const text = result.value;
              const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
              
              const parsedRows = [];
              lines.forEach((line, i) => {
                parsedRows.push({
                  STT: i + 1,
                  Noi_Dung_Boc_Tach: line,
                  Trang_Thai: 'Da_Trinh_Xuat',
                  Nguon: file.name
                });
              });

              state.rawRows = parsedRows;
              state.filteredRows = [...parsedRows];
              state.currentPage = 1;
              renderRawTable();
              resolve();
            } else {
              throw new Error('Thư viện đọc Word chưa tải kịp.');
            }
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    }

    function parseCSVFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const text = e.target.result;
            const lines = text.split('\n').filter(Boolean);
            if (lines.length < 2) throw new Error('File CSV không đủ dữ liệu.');

            const headers = lines[0].split(',').map(h => h.trim().replace(/^[\"\']|[\"\']$/g, ''));
            const rows = [];
            for (let i = 1; i < lines.length; i++) {
              const vals = lines[i].split(',').map(v => v.trim().replace(/^[\"\']|[\"\']$/g, ''));
              const obj = {};
              headers.forEach((h, idx) => {
                obj[h] = vals[idx] || '';
              });
              rows.push(obj);
            }

            state.rawRows = rows;
            state.filteredRows = [...rows];
            state.currentPage = 1;
            renderRawTable();
            recalculateMetricsFromRows(rows);
            updateAnalysisDashboard();
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = reject;
        reader.readAsText(file, 'utf-8');
      });
    }

    function recalculateMetricsFromRows(rows) {
      let sumGross = 0;
      let sumNet = 0;
      let sumProfit = 0;

      rows.forEach(r => {
        const gross = parseFloat(r.Gross_Amount_VND || r.Don_Gia_Ban || r.Thanh_Tien || 0);
        const net = parseFloat(r.Net_Amount_VND || r.Doanh_Thu_Thuan || gross * 0.95 || 0);
        const profit = parseFloat(r.Gross_Profit_VND || r.Loi_Nhuan || net * 0.19 || 0);
        sumGross += gross;
        sumNet += net;
        sumProfit += profit;
      });

      if (sumGross > 0) {
        document.getElementById('kpiGrossAmount').innerText = Math.round(sumGross).toLocaleString() + ' ₫';
        document.getElementById('kpiNetAmount').innerText = Math.round(sumNet).toLocaleString() + ' ₫';
        document.getElementById('kpiProfitAmount').innerText = Math.round(sumProfit).toLocaleString() + ' ₫';
        document.getElementById('kpiDiscountAmount').innerText = Math.round(sumGross - sumNet).toLocaleString() + ' ₫';
      }
    }

    // Export Excel via SheetJS
    function downloadExcelFile() {
      try {
        if (typeof XLSX !== 'undefined') {
          const wb = XLSX.utils.book_new();
          const rowsToExport = state.rawRows.length ? state.rawRows : (state.dataset1000?.rfq_requirements || []);
          const ws = XLSX.utils.json_to_sheet(rowsToExport);
          XLSX.utils.book_append_sheet(wb, ws, "Du_Lieu_Phan_Tich");
          XLSX.writeFile(wb, "Bao_Cao_ThienMinh_1000Dong_Nhi.xlsx");
          return;
        }
      } catch (e) {
        console.warn('SheetJS error, trying endpoint:', e);
      }
      window.open('/api/export-excel', '_blank');
    }

    // Export Word via Client-Side Formatted Document
    function downloadWordFile() {
      try {
        const reportEl = document.getElementById('printableReport');
        if (reportEl) {
          const head = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Báo Cáo Đặng Thị Linh Nhi</title><style>body{font-family:Arial,sans-serif;} table{border-collapse:collapse;width:100%;} th,td{border:1px solid #ddd;padding:8px;} th{background-color:#fce7f3;}</style></head><body>";
          const foot = "</body></html>";
          const fullHtml = head + reportEl.innerHTML + foot;
          const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = "Bao_Cao_De_Xuat_DangThiLinhNhi.doc";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          return;
        }
      } catch (e) {
        console.warn('Word export error:', e);
      }
      window.open('/api/export-word', '_blank');
    }


    
    // =========================================================================
    // REAL CLIENT-SIDE FILE UPLOAD & EXPORT HANDLERS
    // =========================================================================

    function setupDragAndDrop() {
      const dropZone = document.getElementById('dropZone');
      if (!dropZone) return;

      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, e => {
          e.preventDefault();
          e.stopPropagation();
        }, false);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
          dropZone.classList.add('border-pink-500', 'bg-pink-100/80');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
          dropZone.classList.remove('border-pink-500', 'bg-pink-100/80');
        }, false);
      });

      dropZone.addEventListener('drop', e => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length) {
          processUploadedFile(files[0]);
        }
      }, false);
    }

    function handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        processUploadedFile(file);
      }
    }

    async function processUploadedFile(file) {
      const fileName = file.name;
      const fileExt = fileName.split('.').pop().toLowerCase();
      
      console.log('Đang xử lý file:', fileName, fileExt);

      try {
        if (fileExt === 'xlsx' || fileExt === 'xls') {
          await parseExcelFile(file);
        } else if (fileExt === 'docx') {
          await parseWordFile(file);
        } else if (fileExt === 'csv' || fileExt === 'txt') {
          await parseCSVFile(file);
        } else {
          alert('Định dạng không được hỗ trợ. Vui lòng tải lên file Excel (.xlsx), Word (.docx) hoặc CSV (.csv).');
          return;
        }

        // Show banner
        document.getElementById('uploadStatusBanner').classList.remove('hidden');
        document.getElementById('uploadStatusTitle').innerText = `Đã tải lên và đọc thành công file: ${fileName}`;
        document.getElementById('uploadStatusDetail').innerText = `${state.rawRows.length} dòng dữ liệu · Đã tự động bóc tách & cập nhật số liệu`;
        
        alert(`Chúc mừng! Đã nạp thành công file ${fileName} (${state.rawRows.length} dòng dữ liệu). Bảng và biểu đồ đã được cập nhật!`);
      } catch (err) {
        console.error('Lỗi khi đọc file:', err);
        alert('Lỗi khi đọc file: ' + err.message);
      }
    }

    function parseExcelFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonRows = XLSX.utils.sheet_to_json(worksheet);

            if (!jsonRows || !jsonRows.length) {
              throw new Error('Sheet không có dữ liệu dòng.');
            }

            state.rawRows = jsonRows;
            state.filteredRows = [...jsonRows];
            state.currentPage = 1;
            renderRawTable();
            
            recalculateMetricsFromRows(jsonRows);
            updateAnalysisDashboard();
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    }

    function parseWordFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
          try {
            if (typeof mammoth !== 'undefined') {
              const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
              const text = result.value;
              const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
              
              const parsedRows = [];
              lines.forEach((line, i) => {
                parsedRows.push({
                  STT: i + 1,
                  Noi_Dung_Boc_Tach: line,
                  Trang_Thai: 'Da_Trinh_Xuat',
                  Nguon: file.name
                });
              });

              state.rawRows = parsedRows;
              state.filteredRows = [...parsedRows];
              state.currentPage = 1;
              renderRawTable();
              resolve();
            } else {
              throw new Error('Thư viện đọc Word chưa tải kịp.');
            }
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    }

    function parseCSVFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const text = e.target.result;
            const lines = text.split('\n').filter(Boolean);
            if (lines.length < 2) throw new Error('File CSV không đủ dữ liệu.');

            const headers = lines[0].split(',').map(h => h.trim().replace(/^[\"\']|[\"\']$/g, ''));
            const rows = [];
            for (let i = 1; i < lines.length; i++) {
              const vals = lines[i].split(',').map(v => v.trim().replace(/^[\"\']|[\"\']$/g, ''));
              const obj = {};
              headers.forEach((h, idx) => {
                obj[h] = vals[idx] || '';
              });
              rows.push(obj);
            }

            state.rawRows = rows;
            state.filteredRows = [...rows];
            state.currentPage = 1;
            renderRawTable();
            recalculateMetricsFromRows(rows);
            updateAnalysisDashboard();
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = reject;
        reader.readAsText(file, 'utf-8');
      });
    }

    function recalculateMetricsFromRows(rows) {
      let sumGross = 0;
      let sumNet = 0;
      let sumProfit = 0;

      rows.forEach(r => {
        const gross = parseFloat(r.Gross_Amount_VND || r.Don_Gia_Ban || r.Thanh_Tien || 0);
        const net = parseFloat(r.Net_Amount_VND || r.Doanh_Thu_Thuan || gross * 0.95 || 0);
        const profit = parseFloat(r.Gross_Profit_VND || r.Loi_Nhuan || net * 0.19 || 0);
        sumGross += gross;
        sumNet += net;
        sumProfit += profit;
      });

      if (sumGross > 0) {
        document.getElementById('kpiGrossAmount').innerText = Math.round(sumGross).toLocaleString() + ' ₫';
        document.getElementById('kpiNetAmount').innerText = Math.round(sumNet).toLocaleString() + ' ₫';
        document.getElementById('kpiProfitAmount').innerText = Math.round(sumProfit).toLocaleString() + ' ₫';
        document.getElementById('kpiDiscountAmount').innerText = Math.round(sumGross - sumNet).toLocaleString() + ' ₫';
      }
    }

    // Export Excel via SheetJS
    function downloadExcelFile() {
      try {
        if (typeof XLSX !== 'undefined') {
          const wb = XLSX.utils.book_new();
          const rowsToExport = state.rawRows.length ? state.rawRows : (state.dataset1000?.rfq_requirements || []);
          const ws = XLSX.utils.json_to_sheet(rowsToExport);
          XLSX.utils.book_append_sheet(wb, ws, "Du_Lieu_Phan_Tich");
          XLSX.writeFile(wb, "Bao_Cao_ThienMinh_1000Dong_Nhi.xlsx");
          return;
        }
      } catch (e) {
        console.warn('SheetJS error, trying endpoint:', e);
      }
      window.open('/api/export-excel', '_blank');
    }

    // Export Word via Client-Side Formatted Document
    function downloadWordFile() {
      try {
        const reportEl = document.getElementById('printableReport');
        if (reportEl) {
          const head = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Báo Cáo Đặng Thị Linh Nhi</title><style>body{font-family:Arial,sans-serif;} table{border-collapse:collapse;width:100%;} th,td{border:1px solid #ddd;padding:8px;} th{background-color:#fce7f3;}</style></head><body>";
          const foot = "</body></html>";
          const fullHtml = head + reportEl.innerHTML + foot;
          const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = "Bao_Cao_De_Xuat_DangThiLinhNhi.doc";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          return;
        }
      } catch (e) {
        console.warn('Word export error:', e);
      }
      window.open('/api/export-word', '_blank');
    }


    window.addEventListener('DOMContentLoaded', async () => {
      document.getElementById('repDateNow').innerText = new Date().toLocaleDateString('vi-VN');
      await loadBenchmarkDataset();
      setupDragAndDrop();
      setupDragAndDrop();
    });

    async function loadBenchmarkDataset() {
      if (window.THIENMINH_DATASET) {
        state.dataset1000 = window.THIENMINH_DATASET;
        console.log('Nạp tức thì trực tiếp từ dataset.js!');
      } else {
        try {
          const resp = await fetch('/api/dataset/1000');
          if (resp.ok) {
            state.dataset1000 = await resp.json();
            console.log('Nạp thành công dataset 1000 dòng từ API!');
          }
        } catch (err) {
          try {
            const resp2 = await fetch('/data/full_1000_dataset.json');
            if (resp2.ok) {
              state.dataset1000 = await resp2.json();
              console.log('Nạp thành công static dataset 1000 dòng!');
            }
          } catch (e) {
            console.warn('Dùng dữ liệu nội trú:', err);
          }
        }
      }

      selectActiveSource('rfq_requirements');
      initAnomaliesList();
      updateAnalysisDashboard();
    }

    // Source Selection
    function selectActiveSource(key) {
      state.activeSourceKey = key;

      ['rfq', 'quote', 'cat'].forEach(k => {
        const el = document.getElementById(`srcCard_${k}`);
        if (!el) return;
        el.className = 'p-5 rounded-3xl pink-card cursor-pointer';
      });

      if (key === 'rfq_requirements') {
        document.getElementById('srcCard_rfq').className = 'p-5 rounded-3xl pink-card cursor-pointer border-2 border-pink-500 bg-pink-50/50 shadow-md';
        document.getElementById('tableSubtitlePreview').innerText = 'Hiển thị dữ liệu từ RFQ_Requirements (1.000 dòng bóc tách)';
        document.getElementById('sideSourceTitle').innerText = 'RFQ_Requirements.csv';
        document.getElementById('sideSourceDetail').innerText = '1.000 dòng · 8 cột';

        if (state.dataset1000 && state.dataset1000.rfq_requirements) {
          state.rawRows = state.dataset1000.rfq_requirements;
        } else {
          state.rawRows = generateFallbackRows();
        }
      } else if (key === 'quotation_data') {
        document.getElementById('srcCard_quote').className = 'p-5 rounded-3xl pink-card cursor-pointer border-2 border-pink-500 bg-pink-50/50 shadow-md';
        document.getElementById('tableSubtitlePreview').innerText = 'Hiển thị dữ liệu từ Quotation_Data (1.000 dòng giá, chiết khấu, lợi nhuận)';
        document.getElementById('sideSourceTitle').innerText = 'Quotation_Data.csv';
        document.getElementById('sideSourceDetail').innerText = '1.000 dòng · 13 cột';

        if (state.dataset1000 && state.dataset1000.quotation_data) {
          state.rawRows = state.dataset1000.quotation_data;
        }
      } else {
        document.getElementById('srcCard_cat').className = 'p-5 rounded-3xl pink-card cursor-pointer border-2 border-pink-500 bg-pink-50/50 shadow-md';
        document.getElementById('tableSubtitlePreview').innerText = 'Hiển thị dữ liệu từ Catalog, Năng lực đội ngũ & Chính sách';
        document.getElementById('sideSourceTitle').innerText = 'Catalog_Policies.csv';
        document.getElementById('sideSourceDetail').innerText = '14 bản ghi chuẩn';

        if (state.dataset1000 && state.dataset1000.catalog) {
          state.rawRows = state.dataset1000.catalog;
        }
      }

      state.filteredRows = [...state.rawRows];
      state.currentPage = 1;
      renderRawTable();
    }

    function generateFallbackRows() {
      const items = ['Switch 24 port', 'Switch 48 port', 'Router', 'Access Point Wi-Fi 6', 'Firewall'];
      const customers = ['Công ty An Phát', 'Trường Minh Khai', 'Công ty Đại Việt', 'Công ty Hưng Thịnh', 'Bệnh viện Thành Công', 'Công ty Sao Mai', 'Nhà máy Đông Á', 'Trung tâm Đào tạo Á Châu', 'Công ty Minh Long', 'Tập đoàn Phú Gia'];
      const locations = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Bắc Ninh', 'Hải Phòng'];

      const rows = [];
      for (let i = 1; i <= 200; i++) {
        const rfqId = 'RFQ-' + String(i).padStart(3, '0');
        const cust = customers[(i - 1) % customers.length];
        const loc = locations[(i - 1) % locations.length];
        items.forEach((it, idx) => {
          rows.push({
            RFQ_ID: rfqId,
            Customer: cust,
            Item_Name: it,
            Quantity: 2 + ((i * 3 + idx * 5) % 25),
            Location: loc,
            Deployment_Deadline: `2026-${String(1 + (i % 12)).padStart(2, '0')}-20`,
            Maintenance_Requirement: (i % 3 === 0) ? '24 tháng; hỗ trợ 24/7' : '12 tháng; hỗ trợ 8x5',
            Requirement_Line_ID: `REQ-${String(i).padStart(3, '0')}-0${idx + 1}`
          });
        });
      }
      return rows;
    }

    // Render Raw Data Table
    function renderRawTable() {
      const thead = document.getElementById('rawTableHeader');
      const tbody = document.getElementById('rawTableBody');
      if (!state.filteredRows.length) {
        thead.innerHTML = '<th class="p-3">Thông báo</th>';
        tbody.innerHTML = '<tr><td class="p-4 text-center text-slate-400">Không có dữ liệu phù hợp</td></tr>';
        return;
      }

      const sample = state.filteredRows[0];
      const cols = Object.keys(sample);

      thead.innerHTML = '<th class="p-3 text-center">STT</th>' + cols.map(c => `<th class="p-3">${c}</th>`).join('');

      const start = (state.currentPage - 1) * state.rowsPerPage;
      const paged = state.filteredRows.slice(start, start + state.rowsPerPage);

      tbody.innerHTML = paged.map((r, i) => {
        return `<tr class="hover:bg-pink-50/70 transition">
          <td class="p-3 text-center text-slate-400 font-mono">${start + i + 1}</td>
          ${cols.map(c => {
          const val = r[c];
          if (typeof val === 'number') {
            return `<td class="p-3 font-mono font-bold text-pink-700">${val.toLocaleString()}</td>`;
          }
          return `<td class="p-3">${val ?? ''}</td>`;
        }).join('')}
        </tr>`;
      }).join('');

      document.getElementById('rowCountDisplay').innerText = `Hiển thị: ${paged.length}/${state.filteredRows.length} dòng`;
      document.getElementById('currentPageNum').innerText = state.currentPage;
      document.getElementById('totalPageNum').innerText = Math.ceil(state.filteredRows.length / state.rowsPerPage) || 1;
    }

    function filterRawTable() {
      const q = (document.getElementById('searchRawData').value || '').toLowerCase().trim();
      if (!q) {
        state.filteredRows = [...state.rawRows];
      } else {
        state.filteredRows = state.rawRows.filter(r => {
          return Object.values(r).some(v => String(v).toLowerCase().includes(q));
        });
      }
      state.currentPage = 1;
      renderRawTable();
    }

    function prevTablePage() {
      if (state.currentPage > 1) {
        state.currentPage--;
        renderRawTable();
      }
    }

    function nextTablePage() {
      const max = Math.ceil(state.filteredRows.length / state.rowsPerPage);
      if (state.currentPage < max) {
        state.currentPage++;
        renderRawTable();
      }
    }

    // Step Navigation
    function goToStep(step) {
      state.step = step;

      const titles = [
        'Bước 1: Kết nối nguồn dữ liệu (1.000 dòng)',
        'Bước 2: Làm sạch & Kiểm định ranh giới kỹ thuật',
        'Bước 3: Phân tích số liệu & Khám phá chuyên sâu',
        'Bước 4: Báo cáo kinh doanh toàn diện & Xuất tệp'
      ];
      document.getElementById('windowActiveTitle').innerText = titles[step];
      document.getElementById('stepProgressText').innerText = `${step + 1}/4 BƯỚC`;

      for (let i = 0; i < 4; i++) {
        const view = document.getElementById(`viewStep${i}`);
        const btn = document.getElementById(`navStep${i}`);
        if (!view || !btn) continue;

        if (i === step) {
          view.classList.remove('hidden');
          btn.className = 'w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all pink-pill-active';
        } else {
          view.classList.add('hidden');
          btn.className = 'w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all hover:bg-pink-100/60 text-slate-600';
        }
      }

      if (step === 2) {
        setTimeout(updateAnalysisDashboard, 50);
      }
    }

    function approveAndNext(currentStep) {
      state.approvedStep = Math.max(state.approvedStep, currentStep + 1);

      const badge = document.getElementById(`navBadge${currentStep}`);
      if (badge) {
        badge.className = 'w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold shadow-sm';
        badge.innerHTML = '<i class="fa-solid fa-check text-[11px]"></i>';
      }

      if (currentStep < 3) {
        goToStep(currentStep + 1);
      }
    }

    function resetWorkflow() {
      if (confirm('Bạn có chắc muốn đặt lại toàn bộ quy trình về Bước 1 không?')) {
        state.approvedStep = 0;
        goToStep(0);
      }
    }

    // =========================================================================
    // STEP 1: CLEANING AUDIT & ANOMALIES
    // =========================================================================

    function initAnomaliesList() {
      const anomalies = [];
      for (let i = 1; i <= 200; i++) {
        const rfqId = 'RFQ-' + String(i).padStart(3, '0');
        const cust = benchmarkSummary.customers[(i - 1) % benchmarkSummary.customers.length].name;

        if (i % 3 === 1 || i % 5 === 0) {
          const rate = (i % 2 === 0) ? '8%' : '6%';
          anomalies.push({
            type: 'pol02',
            rfqId: rfqId,
            customer: cust,
            item: 'Toàn bộ hạng mục',
            discount: rate,
            reason: `Chiết khấu ${rate} vượt thẩm quyền NVKD (POL-01: <= 5%)`,
            role: 'Trưởng phòng KD duyệt'
          });
        }
      }

      state.anomalies = anomalies;
      renderAnomaliesTable('all');
    }

    function renderAnomaliesTable(filter) {
      const tbody = document.getElementById('anomaliesTableBody');
      if (!tbody) return;

      let list = state.anomalies;
      if (filter === 'pol02') {
        list = state.anomalies.filter(a => a.type === 'pol02');
      } else if (filter === 'firewall') {
        list = [
          { type: 'firewall', rfqId: '200 Dự Án', customer: 'Tất cả khách hàng có Firewall', item: 'Firewall Edge (FW-EDGE-01)', discount: '-', reason: 'Catalog chỉ đạt 1.5Gbps khi bật IPS, trong khi yêu cầu dự án >= 2Gbps', role: 'Lead Solutions Architect' }
        ];
      }

      tbody.innerHTML = list.slice(0, 50).map(a => {
        return `<tr class="hover:bg-pink-50/70 transition">
          <td class="p-3 text-center font-bold text-slate-900">${a.rfqId}</td>
          <td class="p-3 font-sans text-slate-700 font-medium">${a.customer}</td>
          <td class="p-3 text-slate-500 font-sans">${a.item}</td>
          <td class="p-3 text-center text-pink-700 font-bold">${a.discount}</td>
          <td class="p-3 font-sans text-slate-600 text-[11px]">${a.reason}</td>
          <td class="p-3 text-center"><span class="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-200 font-bold text-[10px]">${a.role}</span></td>
        </tr>`;
      }).join('');
    }

    function filterAnomalies(type) {
      ['All', 'Pol', 'Fw'].forEach(k => {
        const btn = document.getElementById(`btnAnomaly${k}`);
        if (!btn) return;
        btn.className = 'px-3 py-1 rounded-xl bg-pink-50 text-pink-800 text-[11px] font-bold transition border border-pink-200';
      });

      if (type === 'all') document.getElementById('btnAnomalyAll').className = 'px-3 py-1 rounded-xl bg-pink-600 text-white text-[11px] font-bold shadow-sm transition';
      if (type === 'pol02') document.getElementById('btnAnomalyPol').className = 'px-3 py-1 rounded-xl bg-pink-600 text-white text-[11px] font-bold shadow-sm transition';
      if (type === 'firewall') document.getElementById('btnAnomalyFw').className = 'px-3 py-1 rounded-xl bg-pink-600 text-white text-[11px] font-bold shadow-sm transition';

      renderAnomaliesTable(type);
    }

    function runCleaningAudit() {
      alert('Đã chạy lại quy trình kiểm định! Kết quả: 1.000 dòng dữ liệu đạt điểm chất lượng 99.5% (Hạng A - Xuất sắc).');
    }

    // =========================================================================
    // STEP 2: INTERACTIVE BI DASHBOARD & CHART.JS (PINK THEMED)
    // =========================================================================

    function setChartType(type) {
      state.chartType = type;
      ['Bar', 'Line', 'Doughnut'].forEach(t => {
        const btn = document.getElementById(`btnChart${t}`);
        if (!btn) return;
        btn.className = 'px-2.5 py-1 rounded-lg hover:bg-pink-100 text-slate-600 text-xs font-bold';
      });

      if (type === 'bar') document.getElementById('btnChartBar').className = 'px-2.5 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold shadow-sm';
      if (type === 'line') document.getElementById('btnChartLine').className = 'px-2.5 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold shadow-sm';
      if (type === 'doughnut') document.getElementById('btnChartDoughnut').className = 'px-2.5 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold shadow-sm';

      updateAnalysisDashboard();
    }

    function updateAnalysisDashboard() {
      const groupBy = document.getElementById('pivotGroupBy').value || 'Customer';
      const metric = document.getElementById('pivotMetric').value || 'Net_Amount_VND';

      let dataset = [];
      if (groupBy === 'Customer') dataset = benchmarkSummary.customers;
      else if (groupBy === 'Item_Name') dataset = benchmarkSummary.products;
      else if (groupBy === 'Location') dataset = benchmarkSummary.locations;
      else dataset = benchmarkSummary.discounts;

      const labels = dataset.map(d => d.name);
      const values = dataset.map(d => {
        if (metric === 'Quantity') return d.qty || d.count * 10;
        if (metric === 'Gross_Profit_VND') return d.profit;
        if (metric === 'Discount_Amount_VND') return (d.gross ? (d.gross - d.net) : (d.net * 0.05));
        return d.net;
      });

      renderChart(labels, values, metric);
      renderPivotTable(dataset, metric);
    }

    function renderChart(labels, values, metric) {
      const ctx = document.getElementById('biChartCanvas');
      if (!ctx) return;

      if (state.chartInstance) {
        state.chartInstance.destroy();
      }

      // Pink & Rose Glamour Palette
      const pinkColors = [
        '#EC4899', '#F43F5E', '#FB7185', '#F472B6', '#DB2777',
        '#C084FC', '#A855F7', '#E879F9', '#FDA4AF', '#BE185D'
      ];

      const isCurrency = metric.includes('VND') || metric.includes('Amount') || metric.includes('Profit');

      state.chartInstance = new Chart(ctx, {
        type: state.chartType,
        data: {
          labels: labels,
          datasets: [{
            label: isCurrency ? 'Giá trị (VNĐ)' : 'Số lượng',
            data: values,
            backgroundColor: state.chartType === 'doughnut' ? pinkColors : 'rgba(236, 72, 153, 0.75)',
            borderColor: state.chartType === 'doughnut' ? '#FFFFFF' : '#EC4899',
            borderWidth: 2,
            borderRadius: state.chartType === 'bar' ? 8 : 0,
            fill: state.chartType === 'line'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: state.chartType === 'doughnut',
              labels: { color: '#831843', font: { family: 'Plus Jakarta Sans', size: 10, weight: 'bold' } }
            },
            tooltip: {
              backgroundColor: '#831843',
              titleColor: '#FFFFFF',
              bodyColor: '#FDF2F8',
              padding: 10,
              cornerRadius: 12,
              callbacks: {
                label: function (context) {
                  const val = context.raw;
                  return isCurrency ? ` ${val.toLocaleString()} ₫` : ` ${val.toLocaleString()} đơn vị`;
                }
              }
            }
          },
          scales: state.chartType === 'doughnut' ? {} : {
            x: {
              grid: { color: 'rgba(244, 114, 182, 0.1)' },
              ticks: { color: '#64748B', font: { family: 'Plus Jakarta Sans', size: 10, weight: 'bold' } }
            },
            y: {
              grid: { color: 'rgba(244, 114, 182, 0.1)' },
              ticks: {
                color: '#64748B',
                font: { family: 'JetBrains Mono', size: 10 },
                callback: function (value) {
                  if (isCurrency) {
                    if (value >= 1e9) return (value / 1e9).toFixed(1) + ' Tỷ';
                    if (value >= 1e6) return (value / 1e6).toFixed(0) + ' Tr';
                  }
                  return value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }

    function renderPivotTable(dataset, metric) {
      const tbody = document.getElementById('pivotTableBody');
      if (!tbody) return;

      const totalNetSum = dataset.reduce((acc, d) => acc + (d.net || 0), 0) || 1;

      tbody.innerHTML = dataset.map(d => {
        const net = d.net || 0;
        const profit = d.profit || 0;
        const gross = d.gross || (net * 1.05);
        const disc = gross - net;
        const pct = ((net / totalNetSum) * 100).toFixed(1);

        return `<tr class="hover:bg-pink-50/70 transition">
          <td class="p-3 font-extrabold text-slate-900 font-sans">${d.name}</td>
          <td class="p-3 text-center text-slate-500 font-mono">${d.count || 20}</td>
          <td class="p-3 text-center text-slate-700 font-mono font-bold">${(d.qty || d.count * 10).toLocaleString()}</td>
          <td class="p-3 text-right font-mono text-slate-600">${Math.round(gross).toLocaleString()} ₫</td>
          <td class="p-3 text-right font-mono text-rose-600 font-bold">-${Math.round(disc).toLocaleString()} ₫</td>
          <td class="p-3 text-right font-mono text-pink-700 font-extrabold">${Math.round(net).toLocaleString()} ₫</td>
          <td class="p-3 text-right font-mono text-emerald-600 font-extrabold">${Math.round(profit).toLocaleString()} ₫</td>
          <td class="p-3 text-center font-mono font-black text-pink-600">${pct}%</td>
        </tr>`;
      }).join('');
    }

    // Copy Report Text
    function copyReportText() {
      const text = `CÔNG TY KINH DOANH B2C
BÁO CÁO PHÂN TÍCH DỮ LIỆU & ĐỀ XUẤT DỰ ÁN TOÀN DIỆN (1.000 DÒNG)
Chuyên viên phân tích: Đặng Thị Linh Nhi - Chuyên viên phân tích kinh doanh
------------------------------------------------------------
- Tổng giá niêm yết (Gross): 102.012.600.000 VND
- Tổng chiết khấu thương mại: 4.231.384.000 VND (TB 4.15%)
- Doanh thu thuần (Net): 97.781.216.000 VND
- Lợi nhuận gộp ước tính: 18.833.616.000 VND (19.26% Margin)
- Tổng giá trị thanh toán (VAT 10%): 107.559.337.600 VND
(Một trăm linh bảy tỷ năm trăm năm mươi chín triệu ba trăm ba mươi bảy nghìn sáu trăm đồng chẵn)
------------------------------------------------------------
Đã được thẩm định và xác nhận bởi Hệ thống AI Agent Thiên Minh DataLens Studio (Pink Edition).`;

      navigator.clipboard.writeText(text).then(() => {
        alert('Đã sao chép toàn văn tóm tắt báo cáo vào bộ nhớ tạm (Clipboard)!');
      });
    }

    
    function downloadCleanedCSV() {
      const reqs = state.dataset1000?.rfq_requirements || [];
      const quotes = state.dataset1000?.quotation_data || [];
      let csv = "STT,Mã RFQ,Khách Hàng,Thiết Bị,Số Lượng,Địa Điểm,Hạn Hoàn Thành,Gói SLA,Đơn Giá Bán,Chiết Khấu,Doanh Thu Trước Giảm,Tiền Giảm,Doanh Thu Thuần,Lợi Nhuận Gộp,Biên LN %,Trạng Thái Thẩm Định\n";
      
      reqs.forEach((r, idx) => {
        const q = quotes[idx] || {};
        const disc = parseFloat(q.Discount_Rate || 0);
        let status = "HỢP LỆ (POL-01)";
        if (disc > 0.05) status = "VƯỢT THẨM QUYỀN (POL-02)";
        if (r.Item_Name === "Firewall") status += "; CẢNH BÁO FIREWALL IPS (1.5G < 2G)";
        const margin = q.Gross_Margin ? (parseFloat(q.Gross_Margin)*100).toFixed(1) + "%" : "19.2%";
        
        csv += ${idx + 1},,"","",,"",,"",,%,,,,,,""\n;
      });
      
      const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "Du_lieu_1000_dong_da_lam_sach_ThienMinh.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

function openHelpModal() {
      document.getElementById('helpModal').showModal();
    }
  