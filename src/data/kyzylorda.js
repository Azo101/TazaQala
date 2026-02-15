export const CITY_CENTER = [44.8488, 65.5022];
export const DEFAULT_ZOOM = 14;

export const TAZAQALA_BASE = {
  id: 'base', name: 'Штаб TazaQala',
  coordinates: [44.8442, 65.5143], address: 'пр. Абай, 1А', type: 'base',
};

export const LANDFILL = {
  id: 'landfill', name: 'Полигон ТБО Кызылорда',
  coordinates: [44.7950, 65.4550], address: 'Южная промзона', type: 'landfill',
};

export const FUEL_CONSUMPTION_PER_100KM = 35;
export const BIN_CAPACITY_LITERS = 275;
export const TRUCK_BIN_CAPACITY = 12;

export const RESIDENT_HOUSES = [
  { id:'H-001', coordinates:[44.8435, 65.5032], name:'ул. Аитеке би, 34', residents:48 },
  { id:'H-002', coordinates:[44.8441, 65.5048], name:'ул. Аитеке би, 52', residents:36 },
  { id:'H-003', coordinates:[44.8429, 65.5065], name:'ул. Аитеке би, 78', residents:60 },
  { id:'H-004', coordinates:[44.8452, 65.5037], name:'ул. Желтоксан, 14', residents:72 },
  { id:'H-005', coordinates:[44.8460, 65.5055], name:'ул. Желтоксан, 30', residents:54 },
  { id:'H-006', coordinates:[44.8448, 65.5071], name:'ул. Байтурсынова, 8', residents:42 },
  { id:'H-007', coordinates:[44.8438, 65.5085], name:'ул. Байтурсынова, 22', residents:90 },
  { id:'H-008', coordinates:[44.8465, 65.5025], name:'ул. Казыбек би, 15', residents:66 },
  { id:'H-009', coordinates:[44.8472, 65.5042], name:'ул. Казыбек би, 33', residents:78 },
  { id:'H-010', coordinates:[44.8458, 65.5093], name:'ул. Токмаганбетова, 5', residents:30 },
  { id:'H-011', coordinates:[44.8485, 65.5010], name:'пр. Коркыт-Ата, 10', residents:120 },
  { id:'H-012', coordinates:[44.8490, 65.5035], name:'пр. Коркыт-Ата, 24', residents:96 },
  { id:'H-013', coordinates:[44.8495, 65.5058], name:'пр. Коркыт-Ата, 40', residents:84 },
  { id:'H-014', coordinates:[44.8500, 65.5080], name:'пр. Коркыт-Ата, 56', residents:108 },
  { id:'H-015', coordinates:[44.8505, 65.5100], name:'пр. Коркыт-Ата, 72', residents:72 },
  { id:'H-016', coordinates:[44.8510, 65.5120], name:'пр. Коркыт-Ата, 88', residents:60 },
  { id:'H-017', coordinates:[44.8483, 65.5048], name:'ул. Кунаева, 7', residents:48 },
  { id:'H-018', coordinates:[44.8478, 65.5072], name:'ул. Кунаева, 21', residents:54 },
  { id:'H-019', coordinates:[44.8492, 65.5090], name:'ул. Кунаева, 37', residents:42 },
  { id:'H-020', coordinates:[44.8488, 65.5110], name:'ул. Кунаева, 53', residents:66 },
  { id:'H-021', coordinates:[44.8555, 65.5135], name:'мкр. Нурсат, д.1', residents:144 },
  { id:'H-022', coordinates:[44.8560, 65.5155], name:'мкр. Нурсат, д.3', residents:120 },
  { id:'H-023', coordinates:[44.8568, 65.5140], name:'мкр. Нурсат, д.5', residents:96 },
  { id:'H-024', coordinates:[44.8575, 65.5160], name:'мкр. Нурсат, д.7', residents:108 },
  { id:'H-025', coordinates:[44.8550, 65.5175], name:'мкр. Нурсат, д.9', residents:132 },
  { id:'H-026', coordinates:[44.8563, 65.5185], name:'мкр. Нурсат, д.11', residents:90 },
  { id:'H-027', coordinates:[44.8545, 65.5150], name:'мкр. Нурсат, д.2', residents:78 },
  { id:'H-028', coordinates:[44.8580, 65.5145], name:'мкр. Нурсат, д.13', residents:66 },
  { id:'H-029', coordinates:[44.8572, 65.5170], name:'мкр. Нурсат, д.15', residents:84 },
  { id:'H-030', coordinates:[44.8558, 65.5195], name:'мкр. Нурсат, д.17', residents:72 },
  { id:'H-031', coordinates:[44.8420, 65.5020], name:'ул. Жибек жолы, 12', residents:36 },
  { id:'H-032', coordinates:[44.8415, 65.5045], name:'ул. Жибек жолы, 28', residents:48 },
  { id:'H-033', coordinates:[44.8410, 65.5068], name:'ул. Жибек жолы, 44', residents:42 },
  { id:'H-034', coordinates:[44.8405, 65.5090], name:'ул. Жибек жолы, 60', residents:54 },
  { id:'H-035', coordinates:[44.8425, 65.5105], name:'ул. Абая, 9', residents:66 },
  { id:'H-036', coordinates:[44.8432, 65.5120], name:'ул. Абая, 25', residents:72 },
  { id:'H-037', coordinates:[44.8418, 65.5135], name:'ул. Абая, 41', residents:48 },
  { id:'H-038', coordinates:[44.8440, 65.5140], name:'ул. Абая, 57', residents:84 },
  { id:'H-039', coordinates:[44.8412, 65.5115], name:'ул. Сейфуллина, 3', residents:30 },
  { id:'H-040', coordinates:[44.8398, 65.5050], name:'ул. Сейфуллина, 19', residents:60 },
  { id:'H-041', coordinates:[44.8515, 65.4985], name:'пр. Назарбаева, 6', residents:90 },
  { id:'H-042', coordinates:[44.8522, 65.5005], name:'пр. Назарбаева, 22', residents:78 },
  { id:'H-043', coordinates:[44.8530, 65.5025], name:'пр. Назарбаева, 38', residents:66 },
  { id:'H-044', coordinates:[44.8535, 65.5045], name:'пр. Назарбаева, 54', residents:102 },
  { id:'H-045', coordinates:[44.8540, 65.5065], name:'пр. Назарбаева, 70', residents:114 },
  { id:'H-046', coordinates:[44.8518, 65.5070], name:'ул. Сулейменова, 11', residents:48 },
  { id:'H-047', coordinates:[44.8525, 65.5090], name:'ул. Сулейменова, 27', residents:54 },
  { id:'H-048', coordinates:[44.8532, 65.5110], name:'ул. Сулейменова, 43', residents:42 },
  { id:'H-049', coordinates:[44.8512, 65.5050], name:'ул. Гани Муратбаева, 8', residents:60 },
  { id:'H-050', coordinates:[44.8508, 65.5030], name:'ул. Гани Муратбаева, 24', residents:36 },
  { id:'H-051', coordinates:[44.8380, 65.4935], name:'мкр. Шымыр, д.1', residents:96 },
  { id:'H-052', coordinates:[44.8375, 65.4955], name:'мкр. Шымыр, д.3', residents:78 },
  { id:'H-053', coordinates:[44.8368, 65.4940], name:'мкр. Шымыр, д.5', residents:108 },
  { id:'H-054', coordinates:[44.8385, 65.4970], name:'мкр. Шымыр, д.7', residents:60 },
  { id:'H-055', coordinates:[44.8390, 65.4950], name:'мкр. Шымыр, д.9', residents:84 },
  { id:'H-056', coordinates:[44.8372, 65.4975], name:'мкр. Шымыр, д.11', residents:72 },
  { id:'H-057', coordinates:[44.8365, 65.4960], name:'мкр. Шымыр, д.13', residents:48 },
  { id:'H-058', coordinates:[44.8395, 65.4985], name:'мкр. Шымыр, д.15', residents:90 },
  { id:'H-059', coordinates:[44.8378, 65.4990], name:'мкр. Шымыр, д.17', residents:54 },
  { id:'H-060', coordinates:[44.8362, 65.4980], name:'мкр. Шымыр, д.19', residents:66 },
  { id:'H-061', coordinates:[44.8475, 65.5150], name:'ул. Бейбарыс, 4', residents:42 },
  { id:'H-062', coordinates:[44.8480, 65.5170], name:'ул. Бейбарыс, 18', residents:54 },
  { id:'H-063', coordinates:[44.8470, 65.5185], name:'ул. Бейбарыс, 32', residents:36 },
  { id:'H-064', coordinates:[44.8468, 65.5165], name:'ул. Момышулы, 7', residents:48 },
  { id:'H-065', coordinates:[44.8462, 65.5145], name:'ул. Момышулы, 21', residents:60 },
  { id:'H-066', coordinates:[44.8485, 65.5195], name:'ул. Момышулы, 35', residents:72 },
  { id:'H-067', coordinates:[44.8455, 65.5155], name:'ул. Достык, 10', residents:90 },
  { id:'H-068', coordinates:[44.8450, 65.5175], name:'ул. Достык, 26', residents:78 },
  { id:'H-069', coordinates:[44.8445, 65.5190], name:'ул. Достык, 42', residents:48 },
  { id:'H-070', coordinates:[44.8490, 65.5160], name:'ул. Достык, 58', residents:84 },
  { id:'H-071', coordinates:[44.8395, 65.5025], name:'ул. Алтынсарина, 6', residents:54 },
  { id:'H-072', coordinates:[44.8388, 65.5045], name:'ул. Алтынсарина, 20', residents:66 },
  { id:'H-073', coordinates:[44.8382, 65.5065], name:'ул. Алтынсарина, 34', residents:42 },
  { id:'H-074', coordinates:[44.8375, 65.5030], name:'ул. Тауелсиздик, 11', residents:78 },
  { id:'H-075', coordinates:[44.8370, 65.5055], name:'ул. Тауелсиздик, 27', residents:48 },
  { id:'H-076', coordinates:[44.8365, 65.5075], name:'ул. Тауелсиздик, 43', residents:36 },
  { id:'H-077', coordinates:[44.8358, 65.5040], name:'ул. Махамбет, 5', residents:60 },
  { id:'H-078', coordinates:[44.8352, 65.5060], name:'ул. Махамбет, 19', residents:90 },
  { id:'H-079', coordinates:[44.8400, 65.5080], name:'ул. Қонаева, 8', residents:72 },
  { id:'H-080', coordinates:[44.8408, 65.5100], name:'ул. Қонаева, 24', residents:48 },
  { id:'H-081', coordinates:[44.8502, 65.4945], name:'ул. Вокзальная, 3', residents:36 },
  { id:'H-082', coordinates:[44.8498, 65.4960], name:'ул. Вокзальная, 15', residents:54 },
  { id:'H-083', coordinates:[44.8492, 65.4975], name:'ул. Амангельды, 8', residents:42 },
  { id:'H-084', coordinates:[44.8488, 65.4955], name:'ул. Амангельды, 22', residents:60 },
  { id:'H-085', coordinates:[44.8495, 65.4940], name:'ул. Толе би, 12', residents:48 },
  { id:'H-086', coordinates:[44.8482, 65.4970], name:'ул. Толе би, 28', residents:78 },
  { id:'H-087', coordinates:[44.8478, 65.4950], name:'ул. Жамбыла, 7', residents:66 },
  { id:'H-088', coordinates:[44.8472, 65.4965], name:'ул. Жамбыла, 21', residents:54 },
  { id:'H-089', coordinates:[44.8508, 65.4930], name:'ул. Сатпаева, 4', residents:90 },
  { id:'H-090', coordinates:[44.8515, 65.4950], name:'ул. Сатпаева, 18', residents:72 },
  { id:'H-091', coordinates:[44.8545, 65.4975], name:'мкр. Акмечеть, д.1', residents:84 },
  { id:'H-092', coordinates:[44.8550, 65.4995], name:'мкр. Акмечеть, д.3', residents:96 },
  { id:'H-093', coordinates:[44.8558, 65.4980], name:'мкр. Акмечеть, д.5', residents:60 },
  { id:'H-094', coordinates:[44.8562, 65.5000], name:'мкр. Акмечеть, д.7', residents:108 },
  { id:'H-095', coordinates:[44.8548, 65.5015], name:'мкр. Акмечеть, д.9', residents:72 },
  { id:'H-096', coordinates:[44.8555, 65.5030], name:'мкр. Акмечеть, д.11', residents:48 },
  { id:'H-097', coordinates:[44.8565, 65.5020], name:'мкр. Акмечеть, д.13', residents:90 },
  { id:'H-098', coordinates:[44.8570, 65.4990], name:'мкр. Акмечеть, д.15', residents:66 },
  { id:'H-099', coordinates:[44.8542, 65.5005], name:'мкр. Акмечеть, д.2', residents:78 },
  { id:'H-100', coordinates:[44.8538, 65.4960], name:'мкр. Акмечеть, д.4', residents:54 },
  { id:'H-101', coordinates:[44.8445, 65.5015], name:'Центральный базар, жилой', residents:24 },
  { id:'H-102', coordinates:[44.8520, 65.5060], name:'ул. Ауэзова, 40', residents:60 },
  { id:'H-103', coordinates:[44.8475, 65.5008], name:'ул. Коркыт-Ата, 2', residents:48 },
  { id:'H-104', coordinates:[44.8530, 65.5140], name:'ул. Ауэзова, 68', residents:36 },
  { id:'H-105', coordinates:[44.8460, 65.5125], name:'ул. Токмаганбетова, 30', residents:54 },
  { id:'H-106', coordinates:[44.8500, 65.5140], name:'пр. Коркыт-Ата, 94', residents:90 },
  { id:'H-107', coordinates:[44.8425, 65.4995], name:'ул. Жибек жолы, 2', residents:42 },
  { id:'H-108', coordinates:[44.8540, 65.5085], name:'пр. Назарбаева, 86', residents:78 },
  { id:'H-109', coordinates:[44.8468, 65.5105], name:'ул. Кунаева, 45', residents:66 },
  { id:'H-110', coordinates:[44.8502, 65.5055], name:'пр. Коркыт-Ата, 48', residents:102 },
  { id:'H-111', coordinates:[44.8450, 65.5060], name:'ул. Байтурсынова, 38', residents:66 },
  { id:'H-112', coordinates:[44.8443, 65.5098], name:'ул. Байтурсынова, 54', residents:48 },
  { id:'H-113', coordinates:[44.8470, 65.5030], name:'ул. Казыбек би, 47', residents:72 },
  { id:'H-114', coordinates:[44.8478, 65.5060], name:'ул. Казыбек би, 63', residents:54 },
  { id:'H-115', coordinates:[44.8495, 65.5020], name:'пр. Коркыт-Ата, 18', residents:84 },
  { id:'H-116', coordinates:[44.8503, 65.5042], name:'пр. Коркыт-Ата, 36', residents:90 },
  { id:'H-117', coordinates:[44.8512, 65.5075], name:'пр. Коркыт-Ата, 62', residents:78 },
  { id:'H-118', coordinates:[44.8518, 65.5095], name:'пр. Коркыт-Ата, 78', residents:66 },
  { id:'H-119', coordinates:[44.8525, 65.5130], name:'ул. Сулейменова, 50', residents:42 },
  { id:'H-120', coordinates:[44.8535, 65.5060], name:'пр. Назарбаева, 62', residents:96 },
  { id:'H-121', coordinates:[44.8345, 65.5020], name:'мкр. Тасбогет, д.1', residents:108 },
  { id:'H-122', coordinates:[44.8350, 65.5045], name:'мкр. Тасбогет, д.3', residents:84 },
  { id:'H-123', coordinates:[44.8338, 65.5035], name:'мкр. Тасбогет, д.5', residents:72 },
  { id:'H-124', coordinates:[44.8342, 65.5060], name:'мкр. Тасбогет, д.7', residents:96 },
  { id:'H-125', coordinates:[44.8355, 65.5070], name:'мкр. Тасбогет, д.9', residents:60 },
  { id:'H-126', coordinates:[44.8348, 65.5085], name:'мкр. Тасбогет, д.11', residents:48 },
  { id:'H-127', coordinates:[44.8585, 65.5120], name:'ул. Сатпаева, 50', residents:66 },
  { id:'H-128', coordinates:[44.8592, 65.5105], name:'ул. Сатпаева, 64', residents:78 },
  { id:'H-129', coordinates:[44.8578, 65.5095], name:'ул. Г. Муратбаева, 40', residents:54 },
  { id:'H-130', coordinates:[44.8590, 65.5080], name:'ул. Г. Муратбаева, 56', residents:90 },
  { id:'H-131', coordinates:[44.8565, 65.5060], name:'ул. Сулейменова, 60', residents:42 },
  { id:'H-132', coordinates:[44.8572, 65.5045], name:'ул. Сулейменова, 74', residents:60 },
  { id:'H-133', coordinates:[44.8455, 65.5045], name:'ул. Желтоксан, 42', residents:36 },
  { id:'H-134', coordinates:[44.8463, 65.5080], name:'ул. Токмаганбетова, 16', residents:48 },
  { id:'H-135', coordinates:[44.8437, 65.5055], name:'ул. Аитеке би, 62', residents:54 },
  { id:'H-136', coordinates:[44.8428, 65.5080], name:'ул. Байтурсынова, 14', residents:72 },
  { id:'H-137', coordinates:[44.8445, 65.5110], name:'ул. Токмаганбетова, 24', residents:42 },
  { id:'H-138', coordinates:[44.8490, 65.5125], name:'ул. Кунаева, 60', residents:60 },
  { id:'H-139', coordinates:[44.8510, 65.5105], name:'пр. Коркыт-Ата, 82', residents:84 },
  { id:'H-140', coordinates:[44.8498, 65.5070], name:'пр. Коркыт-Ата, 52', residents:96 },
  { id:'H-141', coordinates:[44.8458, 65.5200], name:'ул. Достык, 74', residents:54 },
  { id:'H-142', coordinates:[44.8475, 65.5210], name:'ул. Момышулы, 48', residents:66 },
  { id:'H-143', coordinates:[44.8482, 65.5225], name:'ул. Бейбарыс, 50', residents:48 },
  { id:'H-144', coordinates:[44.8495, 65.5200], name:'ул. Достык, 82', residents:72 },
  { id:'H-145', coordinates:[44.8468, 65.5220], name:'ул. Момышулы, 62', residents:36 },
  { id:'H-146', coordinates:[44.8470, 65.4940], name:'ул. Жамбыла, 35', residents:48 },
  { id:'H-147', coordinates:[44.8485, 65.4930], name:'ул. Толе би, 42', residents:60 },
  { id:'H-148', coordinates:[44.8505, 65.4920], name:'ул. Сатпаева, 28', residents:72 },
  { id:'H-149', coordinates:[44.8518, 65.4935], name:'ул. Сатпаева, 36', residents:54 },
  { id:'H-150', coordinates:[44.8525, 65.4965], name:'мкр. Акмечеть, д.20', residents:90 },
];

function generateBinsFromHouses(houses) {
  const bins = [];
  const offsets = [
    [0.00012, 0.00008], [-0.00010, 0.00015], [0.00008, -0.00012],
  ];
  const statuses = ['empty','empty','empty','half','half','full'];
  let id = 1;

  for (const house of houses) {
    const binCount = house.residents > 80 ? 3 : house.residents > 40 ? 2 : 1;
    for (let b = 0; b < binCount; b++) {
      const off = offsets[b % offsets.length];
      const sign = id % 2 === 0 ? 1 : -1;
      const status = statuses[(id * 7 + b * 3) % statuses.length];
      bins.push({
        id: `BIN-${String(id).padStart(3, '0')}`,
        coordinates: [
          house.coordinates[0] + off[0] * sign,
          house.coordinates[1] + off[1] * sign,
        ],
        status,
        address: `${house.name} (двор)`,
        houseId: house.id,
        capacity: BIN_CAPACITY_LITERS,
        fillLevel: status === 'full' ? 275 : status === 'half' ? 140 : 30,
      });
      id++;
    }
  }
  return bins;
}

export const TRASH_BINS = generateBinsFromHouses(RESIDENT_HOUSES);

export const TRUCKS = [
  { id:'TQ-001', driver:'Алексей Иванов', status:'active', fuelLevel:78, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)111-22-33', binsServiced:0, totalBinsServiced:47, kmDriven:0, totalKmDriven:312.5 },
  { id:'TQ-002', driver:'Дмитрий Ким', status:'active', fuelLevel:62, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)222-33-44', binsServiced:0, totalBinsServiced:38, kmDriven:0, totalKmDriven:287.3 },
  { id:'TQ-003', driver:'Марат Султанов', status:'active', fuelLevel:91, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)333-44-55', binsServiced:0, totalBinsServiced:52, kmDriven:0, totalKmDriven:345.1 },
  { id:'TQ-004', driver:'Ерлан Нурмагамбетов', status:'active', fuelLevel:85, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)444-55-66', binsServiced:0, totalBinsServiced:33, kmDriven:0, totalKmDriven:198.7 },
  { id:'TQ-005', driver:'Бауыржан Ахметов', status:'active', fuelLevel:70, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)555-66-77', binsServiced:0, totalBinsServiced:41, kmDriven:0, totalKmDriven:265.4 },
  { id:'TQ-006', driver:'Аскар Жумабеков', status:'active', fuelLevel:55, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)666-77-88', binsServiced:0, totalBinsServiced:29, kmDriven:0, totalKmDriven:178.2 },
  { id:'TQ-007', driver:'Руслан Оспанов', status:'active', fuelLevel:88, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)777-88-99', binsServiced:0, totalBinsServiced:56, kmDriven:0, totalKmDriven:378.9 },
  { id:'TQ-008', driver:'Данияр Кенжебаев', status:'active', fuelLevel:73, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)888-99-00', binsServiced:0, totalBinsServiced:44, kmDriven:0, totalKmDriven:290.1 },
  { id:'TQ-009', driver:'Нурлан Сериков', status:'active', fuelLevel:66, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)999-00-11', binsServiced:0, totalBinsServiced:37, kmDriven:0, totalKmDriven:242.8 },
  { id:'TQ-010', driver:'Тимур Касымов', status:'active', fuelLevel:80, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)010-11-22', binsServiced:0, totalBinsServiced:50, kmDriven:0, totalKmDriven:334.6 },
  { id:'TQ-011', driver:'Арман Байжанов', status:'active', fuelLevel:94, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)011-22-33', binsServiced:0, totalBinsServiced:48, kmDriven:0, totalKmDriven:318.3 },
  { id:'TQ-012', driver:'Канат Муканов', status:'active', fuelLevel:58, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)012-33-44', binsServiced:0, totalBinsServiced:35, kmDriven:0, totalKmDriven:225.7 },
  { id:'TQ-013', driver:'Серик Абдрахманов', status:'on_break', fuelLevel:45, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)013-44-55', binsServiced:0, totalBinsServiced:22, kmDriven:0, totalKmDriven:156.8 },
  { id:'TQ-014', driver:'Олжас Тулеубаев', status:'on_break', fuelLevel:40, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)014-55-66', binsServiced:0, totalBinsServiced:18, kmDriven:0, totalKmDriven:134.2 },
  { id:'TQ-015', driver:'Жандос Есенгалиев', status:'maintenance', fuelLevel:30, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)015-66-77', binsServiced:0, totalBinsServiced:15, kmDriven:0, totalKmDriven:112.5 },
  { id:'TQ-016', driver:'Мадияр Калиев', status:'maintenance', fuelLevel:25, fuelCapacity:120, coordinates:[44.8442, 65.5143], capacity:12, currentLoad:0, phone:'+7(705)016-77-88', binsServiced:0, totalBinsServiced:10, kmDriven:0, totalKmDriven:87.3 },
];

export const ORDERS = [
  { id:'ORD-001', resident:'Айгүл Нурланова', residentId:'user-001', houseId:'H-001', status:'in_progress', truckId:'TQ-001', price:2500, date:'2026-02-15', time:'09:00', paid:true, type:'Вывоз мусора' },
  { id:'ORD-002', resident:'Бауыржан Серік', residentId:'user-002', houseId:'H-021', status:'in_progress', truckId:'TQ-002', price:3000, date:'2026-02-15', time:'09:30', paid:true, type:'Вывоз крупногабарита' },
  { id:'ORD-003', resident:'Сара Төлеген', residentId:'user-003', houseId:'H-041', status:'upcoming', truckId:null, price:2500, date:'2026-02-15', time:'11:00', paid:false, type:'Вывоз мусора' },
  { id:'ORD-004', resident:'Дамир Қасымов', residentId:'user-004', houseId:'H-061', status:'upcoming', truckId:null, price:2500, date:'2026-02-15', time:'12:00', paid:true, type:'Вывоз мусора' },
  { id:'ORD-005', resident:'Айгүл Нурланова', residentId:'user-001', houseId:'H-001', status:'completed', truckId:'TQ-001', price:2000, date:'2026-02-14', time:'15:00', paid:true, type:'Вывоз мусора' },
  { id:'ORD-006', resident:'Нурлан Абдраимов', residentId:'user-005', houseId:'H-051', status:'completed', truckId:'TQ-003', price:3500, date:'2026-02-14', time:'16:30', paid:true, type:'Вывоз крупногабарита' },
  { id:'ORD-007', resident:'Айгүл Нурланова', residentId:'user-001', houseId:'H-001', status:'completed', truckId:'TQ-004', price:2500, date:'2026-02-13', time:'10:00', paid:true, type:'Вывоз мусора' },
  { id:'ORD-008', resident:'Бауыржан Серік', residentId:'user-002', houseId:'H-021', status:'completed', truckId:'TQ-005', price:2000, date:'2026-02-12', time:'14:00', paid:true, type:'Вывоз мусора' },
];

export const MAP_ICONS = {
  binEmpty: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="5" y="7" width="14" height="14" rx="2" fill="#4CAF50" stroke="#2E7D32" stroke-width="1.2"/><rect x="3" y="5" width="18" height="3" rx="1" fill="#4CAF50" stroke="#2E7D32" stroke-width="1.2"/><line x1="9" y1="10" x2="9" y2="19" stroke="#fff" stroke-width="1.2"/><line x1="12" y1="10" x2="12" y2="19" stroke="#fff" stroke-width="1.2"/><line x1="15" y1="10" x2="15" y2="19" stroke="#fff" stroke-width="1.2"/></svg>`)}`,
  binHalf: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="5" y="7" width="14" height="14" rx="2" fill="#FF9800" stroke="#E65100" stroke-width="1.2"/><rect x="3" y="5" width="18" height="3" rx="1" fill="#FF9800" stroke="#E65100" stroke-width="1.2"/><rect x="5" y="14" width="14" height="7" rx="0" fill="#E65100" opacity="0.35"/><line x1="9" y1="10" x2="9" y2="19" stroke="#fff" stroke-width="1.2"/><line x1="12" y1="10" x2="12" y2="19" stroke="#fff" stroke-width="1.2"/><line x1="15" y1="10" x2="15" y2="19" stroke="#fff" stroke-width="1.2"/></svg>`)}`,
  binFull: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="5" y="7" width="14" height="14" rx="2" fill="#F44336" stroke="#B71C1C" stroke-width="1.2"/><rect x="3" y="5" width="18" height="3" rx="1" fill="#F44336" stroke="#B71C1C" stroke-width="1.2"/><rect x="5" y="7" width="14" height="14" rx="2" fill="#B71C1C" opacity="0.3"/><line x1="9" y1="10" x2="9" y2="19" stroke="#fff" stroke-width="1.2"/><line x1="12" y1="10" x2="12" y2="19" stroke="#fff" stroke-width="1.2"/><line x1="15" y1="10" x2="15" y2="19" stroke="#fff" stroke-width="1.2"/></svg>`)}`,
  truck: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect x="3" y="9" width="18" height="12" rx="2" fill="#4338ca" stroke="#312e81" stroke-width="1.2"/><polygon points="21,12 28,12 28,21 21,21" fill="#6366f1" stroke="#312e81" stroke-width="1.2"/><circle cx="9" cy="23" r="2.5" fill="#1e1b4b" stroke="#312e81" stroke-width="1"/><circle cx="25" cy="23" r="2.5" fill="#1e1b4b" stroke="#312e81" stroke-width="1"/><rect x="23" y="14" width="3" height="3" rx="0.5" fill="#c7d2fe" stroke="#312e81" stroke-width="0.5"/></svg>`)}`,
  truckInactive: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect x="3" y="9" width="18" height="12" rx="2" fill="#9ca3af" stroke="#6b7280" stroke-width="1.2"/><polygon points="21,12 28,12 28,21 21,21" fill="#d1d5db" stroke="#6b7280" stroke-width="1.2"/><circle cx="9" cy="23" r="2.5" fill="#4b5563" stroke="#6b7280" stroke-width="1"/><circle cx="25" cy="23" r="2.5" fill="#4b5563" stroke="#6b7280" stroke-width="1"/></svg>`)}`,
  base: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><rect x="6" y="14" width="24" height="18" rx="2" fill="#4338ca" stroke="#312e81" stroke-width="1.5"/><polygon points="4,14 18,4 32,14" fill="#6366f1" stroke="#312e81" stroke-width="1.5"/><rect x="14" y="20" width="8" height="12" rx="1" fill="#e0e7ff"/><text x="18" y="17" text-anchor="middle" fill="#e0e7ff" font-size="6" font-weight="bold" font-family="sans-serif">TQ</text></svg>`)}`,
  landfill: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><ellipse cx="18" cy="27" rx="14" ry="5" fill="#78909C" stroke="#455A64" stroke-width="1.2"/><path d="M6 18 Q10 9 18 11 Q26 9 30 18 L30 27 Q26 32 18 32 Q10 32 6 27Z" fill="#90A4AE" stroke="#455A64" stroke-width="1.2"/><text x="18" y="24" text-anchor="middle" fill="#263238" font-size="6" font-weight="bold" font-family="sans-serif">ТБО</text></svg>`)}`,
  house: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect x="4" y="10" width="12" height="8" rx="1" fill="#a78bfa" stroke="#7c3aed" stroke-width="0.8"/><polygon points="2,10 10,3 18,10" fill="#c4b5fd" stroke="#7c3aed" stroke-width="0.8"/><rect x="8" y="13" width="4" height="5" fill="#fff"/></svg>`)}`,
};

export function getBinIcon(status) {
  if (status === 'full') return MAP_ICONS.binFull;
  if (status === 'half') return MAP_ICONS.binHalf;
  return MAP_ICONS.binEmpty;
}

export function computeStats(bins, trucks, orders) {
  const fullBins = bins.filter(b => b.status === 'full').length;
  const halfBins = bins.filter(b => b.status === 'half').length;
  const emptyBins = bins.filter(b => b.status === 'empty').length;
  const activeTrucks = trucks.filter(t => t.status === 'active').length;
  const paidOrders = orders.filter(o => o.paid);
  const totalRevenue = paidOrders.reduce((s, o) => s + o.price, 0);
  return {
    totalOrders: orders.length, completedOrders: orders.filter(o => o.status === 'completed').length,
    inProgressOrders: orders.filter(o => o.status === 'in_progress').length,
    upcomingOrders: orders.filter(o => o.status === 'upcoming').length,
    totalRevenue, todayRevenue: orders.filter(o => o.date === '2026-02-15' && o.paid).reduce((s, o) => s + o.price, 0),
    averageCheck: paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0,
    totalBins: bins.length, fullBins, halfBins, emptyBins,
    totalTrucks: trucks.length, activeTrucks,
    maintenanceTrucks: trucks.filter(t => t.status === 'maintenance').length,
    wasteCollectedToday: 10, wasteProcessedToday: 3,
    wasteCollectedTotal: 20000, wasteProcessedTotal: 15000,
    fuelConsumedToday: 42.5, avgFuelPerRoute: 8.2,
  };
}

export const STATS = computeStats(TRASH_BINS, TRUCKS, ORDERS);
