<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase — Laporan</title>
</head>
<body>
    <div class="main-content">
        <h1 class="coolveticaa" style="color:#a0beff; font-size:1.5rem; font-weight:700;">
            Dashboard / Purchase / Laporan
        </h1>

        <!-- Tab switch -->
        <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
            <button class="btn-tab active" id="tabPembelianBtn" onclick="switchTab('pembelian')">Laporan Pembelian</button>
            <button class="btn-tab" id="tabMarginBtn" onclick="switchTab('margin')">Laporan Margin</button>
        </div>

        <!-- ============================== -->
        <!-- TAB: LAPORAN PEMBELIAN         -->
        <!-- ============================== -->
        <div class="content-card" id="tabPembelian" style="min-height: 540px;">
            <div class="card-title-row">
                <h2 class="coolveticaa">Laporan Pembelian (Restok)</h2>
            </div>

            <div style="display:flex; gap:0.75rem; margin-bottom:1.25rem; flex-wrap:wrap; align-items:center;">
                <select id="pTahun" class="filter-select" onchange="loadLaporanPembelian()">
                    <option value="0">Semua Tahun</option>
                </select>
                <select id="pBulan" class="filter-select" onchange="loadLaporanPembelian()">
                    <option value="0">Semua Bulan</option>
                    <option value="1">Januari</option><option value="2">Februari</option><option value="3">Maret</option>
                    <option value="4">April</option><option value="5">Mei</option><option value="6">Juni</option>
                    <option value="7">Juli</option><option value="8">Agustus</option><option value="9">September</option>
                    <option value="10">Oktober</option><option value="11">November</option><option value="12">Desember</option>
                </select>
                <select id="pSupplier" class="filter-select" onchange="loadLaporanPembelian()">
                    <option value="0">Semua Supplier</option>
                </select>
            </div>

            <!-- Summary cards -->
            <div style="display:flex; gap:1rem; margin-bottom:1.25rem; flex-wrap:wrap;">
                <div class="summary-card">
                    <div class="summary-label">Total PO</div>
                    <div class="summary-value" id="sumPoCount">0</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">Total Belanja (semua status)</div>
                    <div class="summary-value" id="sumPoTotal">Rp0</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">Total Sudah Dibayar (Paid)</div>
                    <div class="summary-value" id="sumPoPaid">Rp0</div>
                </div>
            </div>

            <table class="styled-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>PO ID</th>
                        <th>Tanggal</th>
                        <th>Supplier</th>
                        <th>Total Barang</th>
                        <th>Total Harga</th>
                        <th>Status</th>
                        <th>Dibuat Oleh</th>
                    </tr>
                </thead>
                <tbody id="pembelianTableBody">
                    <tr><td colspan="8" style="color:#999;">Loading...</td></tr>
                </tbody>
            </table>
        </div>

        <!-- ============================== -->
        <!-- TAB: LAPORAN MARGIN            -->
        <!-- ============================== -->
        <div class="content-card" id="tabMargin" style="min-height: 540px; display:none;">
            <div class="card-title-row">
                <h2 class="coolveticaa">Laporan Margin (Beli vs Jual per Produk)</h2>
            </div>

            <div style="display:flex; gap:0.75rem; margin-bottom:1.25rem; flex-wrap:wrap; align-items:center;">
                <select id="mTahun" class="filter-select" onchange="loadLaporanMargin()">
                    <option value="0">Semua Tahun</option>
                </select>
                <select id="mBulan" class="filter-select" onchange="loadLaporanMargin()">
                    <option value="0">Semua Bulan</option>
                    <option value="1">Januari</option><option value="2">Februari</option><option value="3">Maret</option>
                    <option value="4">April</option><option value="5">Mei</option><option value="6">Juni</option>
                    <option value="7">Juli</option><option value="8">Agustus</option><option value="9">September</option>
                    <option value="10">Oktober</option><option value="11">November</option><option value="12">Desember</option>
                </select>
            </div>

            <div style="display:flex; gap:1rem; margin-bottom:1.25rem; flex-wrap:wrap;">
                <div class="summary-card">
                    <div class="summary-label">Total Modal (Restok Paid)</div>
                    <div class="summary-value" id="sumModal">Rp0</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">Total Pendapatan (Sales)</div>
                    <div class="summary-value" id="sumPendapatan">Rp0</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">Margin Kotor</div>
                    <div class="summary-value" id="sumMargin">Rp0</div>
                </div>
            </div>

            <table class="styled-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Produk</th>
                        <th>Qty Dibeli</th>
                        <th>Total Modal</th>
                        <th>Qty Terjual</th>
                        <th>Total Pendapatan</th>
                        <th>Margin Kotor</th>
                    </tr>
                </thead>
                <tbody id="marginTableBody">
                    <tr><td colspan="7" style="color:#999;">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <style>
        .btn-tab {
            padding: 8px 18px; border-radius: 9999px; border: 1.5px solid #D0DAF0;
            background: white; font-size: 0.88rem; font-weight: 600; cursor: pointer; color: #5A6B8C;
        }
        .btn-tab.active { background: var(--primary-color, #2C4CDF); color: white; border-color: transparent; }
        .filter-select {
            padding: 8px 16px; border: 1.5px solid #D0DAF0; border-radius: 9999px;
            font-size: 0.88rem; outline: none; background: white; cursor: pointer;
        }
        .summary-card {
            background: #F5F8FF; border: 1px solid #D0DAF0; border-radius: 12px;
            padding: 12px 20px; min-width: 200px;
        }
        .summary-label { font-size: 0.78rem; color: #7A8BA8; margin-bottom: 4px; }
        .summary-value { font-size: 1.15rem; font-weight: 700; color: var(--primary-color, #2C4CDF); }
        .margin-positive { color: #0E6E36; font-weight: 700; }
        .margin-negative { color: #E74C3C; font-weight: 700; }
    </style>

    <script src="/cardhaven/interface/purchase/laporan_restok_script.js?v=<?= time() ?>"></script>
</body>
</html>
