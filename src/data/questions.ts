import { Question } from '../types';

export const TRANSLATION_QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'single',
    difficulty: 'easy',
    text: 'Grafik f(x) = x² digeser 3 unit ke atas. Manakah persamaan f(x) yang baru?',
    func: 'x^2',
    params: { a: 1, b: 1, c: 0, d: 3, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: ['f(x) = x² + 3', 'f(x) = x² - 3', 'f(x) = (x+3)²', 'f(x) = (x-3)²', 'f(x) = 3x²'],
    correctIndex: 0
  },
  {
    id: 2,
    type: 'single',
    difficulty: 'easy',
    text: 'Fungsi f(x) = |x| digeser 2 unit ke kanan. Persamaan yang benar adalah...',
    func: 'abs(x)',
    params: { a: 1, b: 1, c: 2, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: ['f(x) = |x| + 2', 'f(x) = |x| - 2', 'f(x) = |x - 2|', 'f(x) = |x + 2|', 'f(x) = 2|x|'],
    correctIndex: 2
  },
  {
    id: 3,
    type: 'single',
    difficulty: 'easy',
    text: 'Garis y = 2x digeser sejauh 4 unit ke bawah. Persamaannya menjadi...',
    func: '2x',
    params: { a: 1, b: 1, c: 0, d: -4, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: ['y = 2x + 4', 'y = 2x - 4', 'y = 2(x-4)', 'y = 2(x+4)', 'y = -2x'],
    correctIndex: 1
  },
  {
    id: 4,
    type: 'single',
    difficulty: 'easy',
    text: 'Fungsi f(x) = x³ digeser ke kiri sejauh 1 unit. Bentuk barunya adalah...',
    func: 'x^3',
    params: { a: 1, b: 1, c: -1, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: ['f(x) = x³ - 1', 'f(x) = x³ + 1', 'f(x) = (x-1)³', 'f(x) = (x+1)³', 'f(x) = -x³'],
    correctIndex: 3
  },
  {
    id: 5,
    type: 'single',
    difficulty: 'easy',
    text: 'Grafik f(x) = 2^x digeser 5 unit ke atas. Dimana posisi asimtot barunya?',
    func: '2^x',
    params: { a: 1, b: 1, c: 0, d: 5, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: ['y = 0', 'y = 2', 'y = 5', 'y = -5', 'y = x + 5'],
    correctIndex: 2
  },
  {
    id: 6,
    type: 'complex',
    difficulty: 'medium',
    text: 'Manakah pernyataan yang BENAR tentang grafik g(x) = (x - 2)² + 3 dibanding f(x) = x²? (Pilih 2)',
    func: 'x^2',
    params: { a: 1, b: 1, c: 2, d: 3, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [
      'Grafik bergeser 2 unit ke kanan',
      'Grafik bergeser 2 unit ke kiri',
      'Titik puncak menjadi (2, 3)',
      'Grafik memotong sumbu Y di (0, 3)',
      'Grafik menjadi lebih lebar'
    ],
    correctIndices: [0, 2]
  },
  {
    id: 7,
    type: 'complex',
    difficulty: 'medium',
    text: 'Fungsi h(x) = 2^(x+4) - 1. Apa saja ciri grafiknya? (Pilih 2)',
    func: '2^x',
    params: { a: 1, b: 1, c: -4, d: -1, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [
      'Asimtot horizontal y = -1',
      'Asimtot horizontal y = 4',
      'Bergeser 4 unit ke kiri',
      'Bergeser 4 unit ke kanan',
      'Grafik memotong sumbu X di (0,0)'
    ],
    correctIndices: [0, 2]
  },
  {
    id: 8,
    type: 'complex',
    difficulty: 'medium',
    text: 'Translasi T(3, -2) diterapkan pada f(x) = |x|. Karakteristik h(x) adalah... (Pilih 2)',
    func: 'abs(x)',
    params: { a: 1, b: 1, c: 3, d: -2, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [
      'Domain fungsi adalah x >= 3',
      'Range fungsi adalah y >= -2',
      'Puncak grafik di (3, -2)',
      'Grafik sejajar sumbu Y',
      'Grafik terbalik ke bawah'
    ],
    correctIndices: [1, 2]
  },
  {
    id: 9,
    type: 'complex',
    difficulty: 'medium',
    text: 'Pernyataan yang tepat untuk g(x) = f(x+1) + 5 adalah... (Pilih 2)',
    func: 'x',
    params: { a: 1, b: 1, c: -1, d: 5, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [
      'Translasi ke kiri 1 unit',
      'Translasi ke kanan 1 unit',
      'Translasi ke atas 5 unit',
      'Titik (0,0) pindah ke (1, 5)',
      'Gradien garis berubah'
    ],
    correctIndices: [0, 2]
  },
  {
    id: 10,
    type: 'complex',
    difficulty: 'medium',
    text: 'Jika f(x) = x² menjadi g(x) = x² - 4x + 4, maka... (Pilih 2)',
    func: '(x-2)^2',
    params: { a: 1, b: 1, c: 2, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [
      'Persamaan g(x) identik dengan (x-2)²',
      'Grafik geser 2 unit ke kanan',
      'Grafik geser 4 unit ke kiri',
      'Puncak grafik di (0, 4)',
      'Grafik memotong sumbu X di dua titik'
    ],
    correctIndices: [0, 1]
  },
  {
    id: 11,
    type: 'dragdrop',
    difficulty: 'hard',
    text: 'Hubungkan deskripsi transformasi dengan persamaannya yang sesuai!',
    func: 'x^2',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [],
    dragItems: [
      { id: 'd1', content: '(x-3)²', matchId: 'm1' },
      { id: 'd2', content: 'x² + 3', matchId: 'm2' },
      { id: 'd3', content: '(x+3)²', matchId: 'm3' },
      { id: 'd4', content: 'x² - 3', matchId: 'm4' }
    ],
    dropZones: [
      { id: 'z1', label: 'Geser Kanan 3', matchId: 'm1' },
      { id: 'z2', label: 'Geser Atas 3', matchId: 'm2' },
      { id: 'z3', label: 'Geser Kiri 3', matchId: 'm3' },
      { id: 'z4', label: 'Geser Bawah 3', matchId: 'm4' }
    ]
  },
  {
    id: 12,
    type: 'dragdrop',
    difficulty: 'hard',
    text: 'Pasangkan hasil translasi dari fungsi f(x) = 2^x berikut!',
    func: '2^x',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [],
    dragItems: [
      { id: 'd1', content: '2^x + 5', matchId: 'm1' },
      { id: 'd2', content: '2^(x-5)', matchId: 'm2' },
      { id: 'd3', content: '2^x - 1', matchId: 'm3' },
      { id: 'd4', content: '2^(x+1)', matchId: 'm4' }
    ],
    dropZones: [
      { id: 'z1', label: 'Asimtot y=5', matchId: 'm1' },
      { id: 'z2', label: 'Geser Kanan 5', matchId: 'm2' },
      { id: 'z3', label: 'Asimtot y=-1', matchId: 'm3' },
      { id: 'z4', label: 'Geser Kiri 1', matchId: 'm4' }
    ]
  },
  {
    id: 13,
    type: 'dragdrop',
    difficulty: 'hard',
    text: 'Cocokkan titik puncak baru dari f(x) = |x| setelah translasi!',
    func: 'abs(x)',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [],
    dragItems: [
      { id: 'd1', content: '(2, 0)', matchId: 'm1' },
      { id: 'd2', content: '(0, -3)', matchId: 'm2' },
      { id: 'd3', content: '(-1, 4)', matchId: 'm3' },
      { id: 'd4', content: '(5, 5)', matchId: 'm4' }
    ],
    dropZones: [
      { id: 'z1', label: '|x - 2|', matchId: 'm1' },
      { id: 'z2', label: '|x| - 3', matchId: 'm2' },
      { id: 'z3', label: '|x + 1| + 4', matchId: 'm3' },
      { id: 'z4', label: '|x - 5| + 5', matchId: 'm4' }
    ]
  },
  {
    id: 14,
    type: 'dragdrop',
    difficulty: 'hard',
    text: 'Match the graph logic for y = 2x + b!',
    func: '2x',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [],
    dragItems: [
      { id: 'd1', content: 'b meningkat', matchId: 'm1' },
      { id: 'd2', content: 'b menurun', matchId: 'm2' },
      { id: 'd3', content: 'x diganti (x-1)', matchId: 'm3' },
      { id: 'd4', content: 'x diganti (x+1)', matchId: 'm4' }
    ],
    dropZones: [
      { id: 'z1', label: 'Naik Vertikal', matchId: 'm1' },
      { id: 'z2', label: 'Turun Vertikal', matchId: 'm2' },
      { id: 'z3', label: 'Geser Kanan 1', matchId: 'm3' },
      { id: 'z4', label: 'Geser Kiri 1', matchId: 'm4' }
    ]
  },
  {
    id: 15,
    type: 'dragdrop',
    difficulty: 'hard',
    text: 'Tentukan tujuan akhir titik (1, 1) pada f(x) = x!',
    func: 'x',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [],
    dragItems: [
      { id: 'd1', content: '(1, 3)', matchId: 'm1' },
      { id: 'd2', content: '(3, 1)', matchId: 'm2' },
      { id: 'd3', content: '(1, -1)', matchId: 'm3' },
      { id: 'd4', content: '(-1, 1)', matchId: 'm4' }
    ],
    dropZones: [
      { id: 'z1', label: 'Translasi (0, 2)', matchId: 'm1' },
      { id: 'z2', label: 'Translasi (2, 0)', matchId: 'm2' },
      { id: 'z3', label: 'Translasi (0, -2)', matchId: 'm3' },
      { id: 'z4', label: 'Translasi (-2, 0)', matchId: 'm4' }
    ]
  }
];

export const REFLECTION_QUESTIONS: Question[] = [
  {
    id: 101,
    type: 'single',
    difficulty: 'easy',
    text: 'Grafik f(x) = x² direfleksikan terhadap sumbu X. Persamaan barunya adalah...',
    func: 'x^2',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: true, reflectY: false, rotation: 0 },
    options: ['f(x) = -x²', 'f(x) = x²', 'f(x) = (-x)²', 'f(x) = 1/x²', 'f(x) = |-x|'],
    correctIndex: 0
  },
  {
    id: 102,
    type: 'single',
    difficulty: 'easy',
    text: 'Jika f(x) = 2^x direfleksikan terhadap sumbu Y, maka persamaannya menjadi...',
    func: '2^x',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: true, rotation: 0 },
    options: ['f(x) = -2^x', 'f(x) = 2^(-x)', 'f(x) = (1/2)^x', 'Semua jawaban benar', 'f(x) = 2^x'],
    correctIndex: 3
  },
  {
    id: 103,
    type: 'single',
    difficulty: 'easy',
    text: 'Fungsi f(x) = |x| direfleksikan terhadap sumbu X lalu digeser 2 unit ke atas. Persamaannya...',
    func: 'abs(x)',
    params: { a: 1, b: 1, c: 0, d: 2, x1: 0, y1: 0, reflectX: true, reflectY: false, rotation: 0 },
    options: ['f(x) = -|x| + 2', 'f(x) = -|x| - 2', 'f(x) = |x| + 2', 'f(x) = |x-2|', 'f(x) = -|x+2|'],
    correctIndex: 0
  },
  {
    id: 104,
    type: 'single',
    difficulty: 'easy',
    text: 'Manakah bentuk refleksi sumbu Y dari g(x) = x³?',
    func: 'x^3',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: true, rotation: 0 },
    options: ['-x³', 'x³', '(-x)³', 'Jawaban A dan C benar', '1/x³'],
    correctIndex: 3
  },
  {
    id: 105,
    type: 'single',
    difficulty: 'easy',
    text: 'Titik (1, 2) berada pada fungsi f(x). Jika direfleksikan terhadap sumbu X, titik tersebut menjadi...',
    func: 'x+1',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: true, reflectY: false, rotation: 0 },
    options: ['(1, -2)', '(-1, 2)', '(-1, -2)', '(2, 1)', '(1, 2)'],
    correctIndex: 0
  },
  {
    id: 106,
    type: 'complex',
    difficulty: 'medium',
    text: 'Manakah pernyataan yang BENAR tentang refleksi f(x) = x² + 1 terhadap sumbu X? (Pilih 2)',
    func: 'x^2+1',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: true, reflectY: false, rotation: 0 },
    options: [
        'Grafik terbuka ke bawah',
        'Titik puncak menjadi (0, -1)',
        'Grafik tidak memotong sumbu X',
        'Persamaan menjadi f(x) = -x² + 1',
        'Grafik tetap terbuka ke atas'
    ],
    correctIndices: [0, 1]
  },
  {
    id: 107,
    type: 'complex',
    difficulty: 'medium',
    text: 'Ciri-ciri f(x) = 2^(-x) adalah... (Pilih 2)',
    func: '2^x',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: true, rotation: 0 },
    options: [
        'Hasil refleksi 2^x terhadap sumbu Y',
        'Hasil refleksi 2^x terhadap sumbu X',
        'Grafik monoton turun',
        'Grafik memotong sumbu Y di (0, -1)',
        'Punya asimtot tegak'
    ],
    correctIndices: [0, 2]
  },
  {
    id: 108,
    type: 'complex',
    difficulty: 'medium',
    text: 'Jika f(x) = |x-3| direfleksikan terhadap sumbu Y, maka... (Pilih 2)',
    func: 'abs(x-3)',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: true, rotation: 0 },
    options: [
        'Puncak pindah ke (-3, 0)',
        'Puncak tetap di (3, 0)',
        'Persamaan menjadi g(x) = |-x-3|',
        'Persamaan menjadi g(x) = |x+3|',
        'Grafik terbalik ke bawah'
    ],
    correctIndices: [0, 2]
  },
  {
    id: 109,
    type: 'complex',
    difficulty: 'medium',
    text: 'Refleksi y = x terhadap sumbu X akan menghasilkan... (Pilih 2)',
    func: 'x',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: true, reflectY: false, rotation: 0 },
    options: [
        'Fungsi y = -x',
        'Fungsi y = x',
        'Garis dengan gradien negatif',
        'Garis yang sejajar dengan y=x',
        'Tidak ada perubahan'
    ],
    correctIndices: [0, 2]
  },
  {
    id: 110,
    type: 'complex',
    difficulty: 'medium',
    text: 'Manakah yang merupakan refleksi f(x)=x? (Pilih 2)',
    func: 'x',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: true, reflectY: true, rotation: 0 },
    options: [
        'Refleksi sumbu X: y=-x',
        'Refleksi sumbu Y: y=-x',
        'Refleksi sumbu X: y=x',
        'Refleksi sumbu Y: y=x',
        'Keduanya menghasilkan garis yang sama'
    ],
    correctIndices: [0, 1]
  },
  {
    id: 111,
    type: 'dragdrop',
    difficulty: 'hard',
    text: 'Cocokkan jenis refleksi dengan persamaannya!',
    func: 'x^2',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [],
    dragItems: [
        { id: 'd1', content: '-f(x)', matchId: 'm1' },
        { id: 'd2', content: 'f(-x)', matchId: 'm2' },
        { id: 'd3', content: '-f(-x)', matchId: 'm3' },
        { id: 'd4', content: 'f(x)', matchId: 'm4' }
    ],
    dropZones: [
        { id: 'z1', label: 'Refleksi Sumbu X', matchId: 'm1' },
        { id: 'z2', label: 'Refleksi Sumbu Y', matchId: 'm2' },
        { id: 'z3', label: 'Rotasi 180°', matchId: 'm3' },
        { id: 'z4', label: 'Identitas', matchId: 'm4' }
    ]
  },
  {
    id: 112,
    type: 'dragdrop',
    difficulty: 'hard',
    text: 'Pasangkan hasil refleksi f(x) = 2^x!',
    func: '2^x',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [],
    dragItems: [
        { id: 'd1', content: '-2^x', matchId: 'm1' },
        { id: 'd2', content: '2^-x', matchId: 'm2' },
        { id: 'd3', content: '-(2^-x)', matchId: 'm3' },
        { id: 'd4', content: '0.5^x', matchId: 'm4' }
    ],
    dropZones: [
        { id: 'z1', label: 'Cermin Sumbu X', matchId: 'm1' },
        { id: 'z2', label: 'Cermin Sumbu Y', matchId: 'm2' },
        { id: 'z3', label: 'Cermin X & Y', matchId: 'm3' },
        { id: 'z4', label: 'Sama dengan d2', matchId: 'm4' }
    ]
  },
  {
    id: 113,
    type: 'single',
    difficulty: 'hard',
    text: 'Bayangan f(x) = x² - 4x + 4 terhadap sumbu Y adalah...',
    func: '(x-2)^2',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: true, rotation: 0 },
    options: ['x² + 4x + 4', 'x² - 4x + 4', '-x² + 4x - 4', '(x+2)²', 'Jawaban A & D benar'],
    correctIndex: 4
  }
];

export const DILATION_QUESTIONS: Question[] = [
  {
    id: 201,
    type: 'single',
    difficulty: 'easy',
    text: 'Fungsi f(x) = x² diregangkan vertikal dengan faktor skala 3. Persamaannya adalah...',
    func: 'x^2',
    params: { a: 3, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: ['f(x) = 3x²', 'f(x) = (3x)²', 'f(x) = x² + 3', 'f(x) = 1/3 x²', 'f(x) = x² - 3'],
    correctIndex: 0
  },
  {
    id: 202,
    type: 'single',
    difficulty: 'easy',
    text: 'Jika f(x) = |x| disusutkan vertikal faktor 1/2, grafiknya akan menjadi...',
    func: 'abs(x)',
    params: { a: 0.5, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: ['Lebih curam', 'Lebih lebar/landai', 'Tetap sama', 'Terbalik', 'Bergeser'],
    correctIndex: 1
  },
  {
    id: 203,
    type: 'single',
    difficulty: 'easy',
    text: 'Peregangan horizontal f(b.x) dengan b=2 pada f(x)=x² menghasilkan...',
    func: 'x^2',
    params: { a: 1, b: 2, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: ['(2x)²', '2x²', '0.5x²', '(0.5x)²', 'x²+2'],
    correctIndex: 0
  },
  {
    id: 204,
    type: 'single',
    difficulty: 'easy',
    text: 'Manakah faktor skala yang membuat grafik f(x) menjadi lebih curam ke atas?',
    func: 'x^2',
    params: { a: 2, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: ['a = 2', 'a = 0.5', 'a = 1', 'a = -1', 'a = 0'],
    correctIndex: 0
  },
  {
    id: 205,
    type: 'single',
    difficulty: 'easy',
    text: 'Jika f(x) = x+2 dikali 5 (vertikal), persamaannya menjadi...',
    func: 'x+2',
    params: { a: 5, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: ['5x + 10', '5x + 2', 'x + 10', '5(x+2)', 'Jawaban A & D benar'],
    correctIndex: 4
  },
  {
    id: 206,
    type: 'complex',
    difficulty: 'medium',
    text: 'Pernyataan benar tentang g(x) = 0.5 * x² adalah... (Pilih 2)',
    func: 'x^2',
    params: { a: 0.5, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [
        'Penyusutan vertikal',
        'Peregangan vertikal',
        'Grafik lebih lebar dari x²',
        'Grafik lebih sempit dari x²',
        'Grafik terbalik'
    ],
    correctIndices: [0, 2]
  },
  {
    id: 207,
    type: 'complex',
    difficulty: 'medium',
    text: 'Jika f(x) = 2^x menjadi g(x) = 2^(3x), maka... (Pilih 2)',
    func: '2^x',
    params: { a: 1, b: 3, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [
        'Penyusutan horizontal',
        'Peregangan horizontal',
        'Faktor skala b = 3',
        'Grafik bergeser ke kanan',
        'Asimtot berubah'
    ],
    correctIndices: [0, 2]
  },
  {
    id: 208,
    type: 'complex',
    difficulty: 'medium',
    text: 'Dilatasi vertikal faktor 4 pada f(x) = |x| mengakibatkan... (Pilih 2)',
    func: 'abs(x)',
    params: { a: 4, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [
        'Titik (1,1) menjadi (1,4)',
        'Titik (1,1) menjadi (4,1)',
        'Grafik semakin curam',
        'Grafik semakin landai',
        'Puncak pindah ke (4,0)'
    ],
    correctIndices: [0, 2]
  },
  {
    id: 209,
    type: 'dragdrop',
    difficulty: 'hard',
    text: 'Cocokkan faktor skala dengan efeknya!',
    func: 'x^2',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [],
    dragItems: [
        { id: 'd1', content: 'a = 2', matchId: 'm1' },
        { id: 'd2', content: 'a = 0.5', matchId: 'm2' },
        { id: 'd3', content: 'b = 2 (horiz)', matchId: 'm3' },
        { id: 'd4', content: 'b = 0.5 (horiz)', matchId: 'm4' }
    ],
    dropZones: [
        { id: 'z1', label: 'Regang Vertikal', matchId: 'm1' },
        { id: 'z2', label: 'Susut Vertikal', matchId: 'm2' },
        { id: 'z3', label: 'Susut Horizontal', matchId: 'm3' },
        { id: 'z4', label: 'Regang Horizontal', matchId: 'm4' }
    ]
  }
];

export const ROTATION_QUESTIONS: Question[] = [
  {
    id: 301,
    type: 'single',
    difficulty: 'easy',
    text: 'Rotasi 180° terhadap titik pusat (0,0) identik dengan...',
    func: 'x^2',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: true, reflectY: true, rotation: 0 },
    options: ['Refleksi Sumbu X saja', 'Refleksi Sumbu Y saja', 'Refleksi Sumbu X DAN Sumbu Y', 'Translasi sejauh 180 unit', 'Tidak ada yang benar'],
    correctIndex: 2
  },
  {
    id: 302,
    type: 'single',
    difficulty: 'easy',
    text: 'Grafik f(x) = x dirotasikan 180° terhadap (0,0) akan menjadi...',
    func: 'x',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 180 },
    options: ['f(x) = -x', 'f(x) = x', 'f(x) = 1/x', 'Sumbu X', 'Sumbu Y'],
    correctIndex: 1
  },
  {
    id: 303,
    type: 'single',
    difficulty: 'easy',
    text: 'Rotasi 360° pada fungsi f(x) = sin(x) menghasilkan...',
    func: 'sin(x)',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 360 },
    options: ['f(x) = sin(x)', 'f(x) = -sin(x)', 'f(x) = cos(x)', 'f(x) = 0', 'Sumbu X'],
    correctIndex: 0
  },
  {
    id: 304,
    type: 'complex',
    difficulty: 'medium',
    text: 'Pernyataan benar tentang rotasi 180° f(x) = x² adalah... (Pilih 2)',
    func: 'x^2',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 180 },
    options: [
        'Grafik terbuka ke bawah',
        'Persamaan menjadi g(x) = -x²',
        'Grafik tetap terbuka ke atas',
        'Titik puncak pindah ke (0, 1)',
        'Grafik hilang'
    ],
    correctIndices: [0, 1]
  },
  {
    id: 305,
    type: 'complex',
    difficulty: 'medium',
    text: 'Ciri rotasi 180° pada f(x) = x³ adalah... (Pilih 2)',
    func: 'x^3',
    params: { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 180 },
    options: [
        'Grafik tidak berubah secara visual',
        'Persamaan matematis g(x) = -(-x)³',
        'Grafik terbalik',
        'Menjadi fungsi kuadrat',
        'Menjadi garis lurus'
    ],
    correctIndices: [0, 1]
  }
];

export const COMBINATION_QUESTIONS: Question[] = [
  {
    id: 401,
    type: 'single',
    difficulty: 'medium',
    text: 'Fungsi f(x) = x² digeser 2 ke kanan, lalu direfleksikan terhadap sumbu X. Persamaannya...',
    func: 'x^2',
    params: { a: 1, b: 1, c: 2, d: 0, x1: 0, y1: 0, reflectX: true, reflectY: false, rotation: 0 },
    options: ['g(x) = -(x-2)²', 'g(x) = -x² + 2', 'g(x) = (-x-2)²', 'g(x) = -(x+2)²', 'g(x) = x² - 2'],
    correctIndex: 0
  },
  {
    id: 402,
    type: 'single',
    difficulty: 'medium',
    text: 'Jika f(x) = |x| diregangkan vertikal faktor 2 lalu digeser 1 unit ke bawah, persamaannya...',
    func: 'abs(x)',
    params: { a: 2, b: 1, c: 0, d: -1, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: ['2|x| - 1', '2|x - 1|', '|2x| - 1', '0.5|x| - 1', '2|x| + 1'],
    correctIndex: 0
  },
  {
    id: 403,
    type: 'complex',
    difficulty: 'hard',
    text: 'Langkah transformasi f(x) = x² menjadi g(x) = -(x+3)² + 4 adalah... (Pilih 3)',
    func: 'x^2',
    params: { a: 1, b: 1, c: -3, d: 4, x1: 0, y1: 0, reflectX: true, reflectY: false, rotation: 0 },
    options: [
        'Geser kiri 3 unit',
        'Refleksi sumbu X',
        'Geser atas 4 unit',
        'Geser kanan 3 unit',
        'Refleksi sumbu Y'
    ],
    correctIndices: [0, 1, 2]
  },
  {
    id: 404,
    type: 'dragdrop',
    difficulty: 'hard',
    text: 'Susun urutan transformasi untuk h(x) = 2(x-1)³ dari f(x) = x³!',
    func: 'x^3',
    params: { a: 2, b: 1, c: 1, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 },
    options: [],
    dragItems: [
        { id: 'd1', content: 'Geser Kanan 1', matchId: 'm1' },
        { id: 'd2', content: 'Regang Vertikal 2', matchId: 'm2' },
        { id: 'd3', content: 'Siapkan f(x)=x³', matchId: 'm3' }
    ],
    dropZones: [
        { id: 'z1', label: 'Tahap 1', matchId: 'm3' },
        { id: 'z2', label: 'Tahap 2', matchId: 'm1' },
        { id: 'z3', label: 'Tahap 3', matchId: 'm2' }
    ]
  }
];

// Helper to get questions based on module
export const getQuestionsForModule = (moduleId: string): Question[] => {
  switch (moduleId) {
    case 'translasi': return TRANSLATION_QUESTIONS;
    case 'refleksi': return REFLECTION_QUESTIONS;
    case 'dilatasi': return DILATION_QUESTIONS;
    case 'rotasi': return ROTATION_QUESTIONS;
    case 'kombinasi': return COMBINATION_QUESTIONS;
    default: return TRANSLATION_QUESTIONS;
  }
};

export const ALL_QUESTIONS_POOL = [
    ...TRANSLATION_QUESTIONS,
    ...REFLECTION_QUESTIONS,
    ...DILATION_QUESTIONS,
    ...ROTATION_QUESTIONS,
    ...COMBINATION_QUESTIONS
];
