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
            <td colspan="13" style="text-align: center; font-size: 13px; font-weight: bold">LAPORAN DATA PEGAWAI</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="13" style="text-align: center"></td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
        <tr>
            <th></th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">NO</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">NIK</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">NAMA PEGAWAI</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">JABATAN</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">TEMPAT LAHIR</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">TANGGAL LAHIR</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">JENIS KELAMIN</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">ALAMAT</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">AGAMA</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">STATUS PERKAWINAN</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">PENDIDIKAN</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">TELEPON</th>
            <th style="font-weight: bold; vertical-align: center; text-align: center; border: 1px solid black">STATUS PEGAWAI</th>
        </tr>
    </thead>
    <tbody>
        @php
            $no = 1;
        @endphp
        @foreach ($data as $d)
            <tr>
                <td></td>
                <td style="border: 1px solid black">{{ $no }}</td>
                <td style="border: 1px solid black">{{ $d->nik }}</td>
                <td style="border: 1px solid black">{{ $d->nama_pegawai }}</td>
                <td style="border: 1px solid black">{{ $d->jabatan->nama_jabatan }}</td>
                <td style="border: 1px solid black">{{ $d->tempat_lahir }}</td>
                <td style="border: 1px solid black">{{ $d->tanggal_lahir }}</td>
                <td style="border: 1px solid black">{{ $d->jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan' }}</td>
                <td style="border: 1px solid black">{{ $d->alamat }}</td>
                <td style="border: 1px solid black">{{ $d->agama }}</td>
                <td style="border: 1px solid black">{{ $d->status_perkawinan === 0 ? 'Belum Menikah' : 'Sudah Menikah' }}</td>
                <td style="border: 1px solid black">{{ $d->pendidikan }}</td>
                <td style="border: 1px solid black">{{ $d->no_telepon }}</td>
                <td style="border: 1px solid black">{{ $d->status === 0 ? 'Pekerja Kontrak' : 'Pekerja Tetap' }}</td>
            </tr>
            @php
                $no++;
            @endphp
        @endforeach
    </tbody>
</table>

<table>
  <tbody>
    <tr>
      <td></td>
      <td colspan="13"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="9"></td>
      <td colspan="3" style="text-align: center">Gianyar, {{ date('d-m-Y') }}</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="9"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="9"></td>
      <td colspan="3" style="text-align: center">Pembuku</td>
    </tr>
    <tr>
      <td></td>
      <td colspan="9"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="9"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="9"></td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="9"></td>
      <td colspan="3" style="text-align: center; font-weight: bold">______________________</td>
    </tr>
  </tbody>
</table>
