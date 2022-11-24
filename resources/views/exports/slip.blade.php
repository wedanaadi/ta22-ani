<style>
    .text-right {
        text-align: right;
    }

    .text-left {
        text-align: left;
    }

    .text-center {
        text-align: center;
    }

    .align-middle {
        vertical-align: middle;
    }

    .border-tabel {
        border: 1px solid red
    }
</style>

<table>
    <tbody>
        <tr>
            <td></td>
            <td colspan="5" style="text-align: center; font-size: 13px; font-weight: bold">SLIP GAJI</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="5" style="text-align: center"></td>
        </tr>
    </tbody>
</table>

<table>
    <tbody>
        <tr>
            <td></td>
            <td>NAMA</td>
            <td>: {{ $data->pegawai->nama_pegawai }}</td>
        </tr>
        <tr>
            <td></td>
            <td>JABATAN</td>
            <td>: {{ $data->pegawai->jabatan->nama_jabatan }}</td>
        </tr>
        <tr>
            <td></td>
            <td>TOTAL HARI DALAM 1 BULAN</td>
            <td>: {{ date('t') - 4 }} days</td>
        </tr>
        <tr>
            <td></td>
            <td>TOTAL HARI KERJA</td>
            <td>: {{ $data->total_hadir }} days</td>
        </tr>
        <tr>
            <td></td>
            <td>OFF DAY</td>
            <td>: {{ $data->total_hadir }} days</td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
        <tr>
            <th></th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">KETERANGAN
            </th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">JUMLAH
            </th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">HARI KERJA
            </th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">PERHARI
            </th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">TOTAL</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td></td>
            <td style="border: 1px solid black">GAJI POKOK</td>
            <td style="border: 1px solid black">{{ number_format($data->gaji_pokok, 0) }}</td>
            <td style="border: 1px solid black">{{ $data->total_hadir }}</td>
            <td style="border: 1px solid black">{{ number_format($data->gaji_harian, 0) }}</td>
            <td style="border: 1px solid black">{{ number_format($data->gaji_harian * $data->total_hadir, 0) }}
            </td>
        </tr>
        <tr>
            <td></td>
            <td colspan="5" style="border: 1px solid black"></td>
        </tr>
        <tr>
            <td></td>
            <td style="border: 1px solid black">TUNJANGAN</td>
            <td style="border: 1px solid black">{{ number_format($data->tunjangan, 0) }}</td>
            <td style="border: 1px solid black">{{ $data->total_hadir }}</td>
            <td style="border: 1px solid black">{{ number_format($data->tunjangan_harian, 0) }}</td>
            <td style="border: 1px solid black">
                {{ number_format($data->tunjangan_harian * $data->total_hadir, 0) }}</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th></th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black"
                colspan="4">TOTAL</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">
                {{ number_format($data->total, 0) }}</th>
        </tr>
    </tfoot>
</table>

<table>
  <tbody>
    <tr>
      <td></td>
      <td colspan="5"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2"></td>
      <td colspan="3" style="text-align: center">Gianyar, {{ date('d-m-Y') }}</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2"></td>
      <td colspan="3" style="text-align: center">Pembuku</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2"></td>
      <td colspan="3" style="text-align: center; font-weight: bold">______________________</td>
    </tr>
  </tbody>
</table>

