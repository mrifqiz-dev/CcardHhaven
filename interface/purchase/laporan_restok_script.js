const API      = '/cardhaven/interface/purchase/controller_restok.php';
const ACTOR_ID = parseInt(sessionStorage.getItem('id_pengguna') || localStorage.getItem('id_pengguna') || 0);

function formatRupiah(n) {
    return 'Rp' + Number(n || 0).toLocaleString('id-ID');
}

function statusLabel(s) {
    const map = { 0: 'Pending', 1: 'Approved', 2: 'Rejected', 3: 'Received', 4: 'Paid' };
    return map[parseInt(s)] ?? '-';
}

// ─── TAB SWITCH ─────────────────────────────────────────────────────────────
function switchTab(tab) {
    document.getElementById('tabPembelian').style.display = (tab === 'pembelian') ? '' : 'none';
    document.getElementById('tabMargin').style.display = (tab === 'margin') ? '' : 'none';
    document.getElementById('tabPembelianBtn').classList.toggle('active', tab === 'pembelian');
    document.getElementById('tabMarginBtn').classList.toggle('active', tab === 'margin');
}

// ─── ISI DROPDOWN TAHUN (5 tahun terakhir) ──────────────────────────────────
function fillYearOptions(selectId) {
    const sel = document.getElementById(selectId);
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 4; y--) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        sel.appendChild(opt);
    }
}

// ─── LAPORAN PEMBELIAN ───────────────────────────────────────────────────────
function loadLaporanPembelian() {
    const tahun      = document.getElementById('pTahun').value;
    const bulan      = document.getElementById('pBulan').value;
    const idSupplier = document.getElementById('pSupplier').value;

    const params = new URLSearchParams({
        action: 'getLaporanPembelian',
        tahun, bulan,
        id_supplier: idSupplier,
        actor_id: ACTOR_ID,
    });

    const tbody = document.getElementById('pembelianTableBody');
    tbody.innerHTML = '<tr><td colspan="8" style="color:#999;">Loading...</td></tr>';

    fetch(`${API}?${params}`)
        .then(r => r.json())
        .then(res => {
            if (res.status !== 'success') {
                tbody.innerHTML = `<tr><td colspan="8" style="color:#E74C3C;">${res.message}</td></tr>`;
                return;
            }

            const rows = res.data.rows || [];

            if (!rows.length) {
                tbody.innerHTML = '<tr><td colspan="8" style="color:#999;">Tidak ada data.</td></tr>';
                document.getElementById('sumPoCount').textContent = '0';
                document.getElementById('sumPoTotal').textContent = formatRupiah(0);
                document.getElementById('sumPoPaid').textContent = formatRupiah(0);
                return;
            }

            let html = '';
            let totalSemua = 0;
            let totalPaid = 0;

            rows.forEach((row, i) => {
                totalSemua += Number(row.total_harga || 0);
                if (parseInt(row.status_restok) === 4) totalPaid += Number(row.total_harga || 0);

                html += `
                <tr>
                    <td>${i + 1}</td>
                    <td>#${row.id_restok}</td>
                    <td>${row.tanggal_restok}</td>
                    <td style="text-align:left;">${row.nama_suplier ?? '-'}</td>
                    <td style="text-align:right;">${row.total_barang}</td>
                    <td style="text-align:right; font-weight:600;">${formatRupiah(row.total_harga)}</td>
                    <td>${statusLabel(row.status_restok)}</td>
                    <td>${row.dibuat_oleh ?? '-'}</td>
                </tr>`;
            });

            tbody.innerHTML = html;
            document.getElementById('sumPoCount').textContent = rows.length;
            document.getElementById('sumPoTotal').textContent = formatRupiah(totalSemua);
            document.getElementById('sumPoPaid').textContent = formatRupiah(totalPaid);
        })
        .catch(() => {
            tbody.innerHTML = '<tr><td colspan="8" style="color:#E74C3C;">Gagal memuat laporan.</td></tr>';
        });
}

// ─── LAPORAN MARGIN ──────────────────────────────────────────────────────────
function loadLaporanMargin() {
    const tahun = document.getElementById('mTahun').value;
    const bulan = document.getElementById('mBulan').value;

    const params = new URLSearchParams({ action: 'getLaporanMargin', tahun, bulan, actor_id: ACTOR_ID });

    const tbody = document.getElementById('marginTableBody');
    tbody.innerHTML = '<tr><td colspan="7" style="color:#999;">Loading...</td></tr>';

    fetch(`${API}?${params}`)
        .then(r => r.json())
        .then(res => {
            if (res.status !== 'success') {
                tbody.innerHTML = `<tr><td colspan="7" style="color:#E74C3C;">${res.message}</td></tr>`;
                return;
            }

            const rows = res.data.rows || [];

            if (!rows.length) {
                tbody.innerHTML = '<tr><td colspan="7" style="color:#999;">Tidak ada data.</td></tr>';
                document.getElementById('sumModal').textContent = formatRupiah(0);
                document.getElementById('sumPendapatan').textContent = formatRupiah(0);
                document.getElementById('sumMargin').textContent = formatRupiah(0);
                return;
            }

            let html = '';
            let totalModal = 0, totalPendapatan = 0, totalMargin = 0;

            rows.forEach((row, i) => {
                totalModal += Number(row.total_modal || 0);
                totalPendapatan += Number(row.total_pendapatan || 0);
                totalMargin += Number(row.margin_kotor || 0);

                const marginClass = Number(row.margin_kotor) >= 0 ? 'margin-positive' : 'margin-negative';

                html += `
                <tr>
                    <td>${i + 1}</td>
                    <td style="text-align:left;">${row.nama_produk ?? '-'}</td>
                    <td style="text-align:right;">${row.qty_dibeli}</td>
                    <td style="text-align:right;">${formatRupiah(row.total_modal)}</td>
                    <td style="text-align:right;">${row.qty_terjual}</td>
                    <td style="text-align:right;">${formatRupiah(row.total_pendapatan)}</td>
                    <td style="text-align:right;" class="${marginClass}">${formatRupiah(row.margin_kotor)}</td>
                </tr>`;
            });

            tbody.innerHTML = html;
            document.getElementById('sumModal').textContent = formatRupiah(totalModal);
            document.getElementById('sumPendapatan').textContent = formatRupiah(totalPendapatan);
            document.getElementById('sumMargin').textContent = formatRupiah(totalMargin);
        })
        .catch(() => {
            tbody.innerHTML = '<tr><td colspan="7" style="color:#E74C3C;">Gagal memuat laporan.</td></tr>';
        });
}

// ─── SUPPLIER DROPDOWN (dipakai filter Laporan Pembelian) ───────────────────
function loadSupplierFilter() {
    fetch(`${API}?action=getSuppliers&actor_id=${ACTOR_ID}`)
        .then(r => r.json())
        .then(res => {
            if (res.status !== 'success') return;
            const sel = document.getElementById('pSupplier');
            res.data.rows.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.id_supplier;
                opt.textContent = s.nama_suplier;
                sel.appendChild(opt);
            });
        });
}

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    fillYearOptions('pTahun');
    fillYearOptions('mTahun');
    loadSupplierFilter();
    loadLaporanPembelian();
    loadLaporanMargin();
});
