import { Course } from '../types'
// Using placeholder images for now
const img1 = '/src/assets/kids.jfif'
const img3 = '/src/assets/pool.jpg'

export const courses: Course[] = [
  {
    id: 1,
    number: '01',
    title: 'Anfänger - Schwimmkurse',
    age: 'ab 5 Jahre',
    level: 'beginner',
    badge: 'seepferdchen',
    image: img1,
    duration: '45 Minuten',
    lessons: '10 Trainingseinheiten',
    kids: 'von 8-12 Kinder',
    price: '€165',
    location: 'Bad Sassendorf',
    startDate: '08. Februar 2026',
    endDate: '19. April 2026',
    day: 'Sonntag',
    times: ['14:00 - 14:45', '14:45 - 15:30', '15:30 - 16:15'],
    description: [
      {
        rules: [
          'Ein Sprung vom Beckenrand mit anschließendem 25 m Schwimmen (ohne Schwimmhilfe) in eine Schwimmart in Bauch oder Rückenlage (Grobform, während des Schwimmens in Bauchlage erkennbar ins Wasser ausatmen)',
          'Heraufholen eines Tauchrings mit den Händen aus schultertiefen Wasser',
          '3-5 Baderegeln, die Sie auch auf meiner Homepage finden können'
        ],
        about: 'Während unseres Anfänger- Schwimmkurses werden die Kinder auf spielerische Art und Weise, das sichere und eigenständige Bewegen, im Wasser erarbeiten. Inhaltlich folgen nach der spielerischen Wassergewöhnung das Atmen, Tauchen, Springen, Gleiten und natürlich die ersten Arm und Beinbewegungen des Schwimmens. Kurs wird voraussichtlich mit dem Schwimmabzeichen Seepferdchen abgeschlossen.',
        subTitle: 'Anforderungen zum Schwimmabzeichen Seepferdchen'
      }
    ]
  },
  {
    id: 2,
    number: '02',
    title: 'Bronze, Silber - und Goldkurs',
    age: 'von 6 - 14 Jahre',
    level: 'advanced',
    badge: 'gold',
    image: img3,
    duration: '45 Minuten',
    lessons: '8 Trainingseinheiten',
    kids: 'von 8-12 Kinder',
    price: '€155',
    location: 'Bad Sassendorf',
    startDate: '16. November 2025',
    endDate: '18. Januar 2026',
    day: 'Sonntag',
    times: ['16:15 - 17:00', '17:00 - 17:45'],
    description: [
      {
        rules: [
          'Sprung Kopfwärts vom Beckenrand und 15 Minuten Schwimmen. In dieser Zeit sind mindestens 200 m zurückzulegen, davon 150 m in Bauch- oder Rückenlage in einer erkennbaren Schwimmart und 50 m in der anderen Körperlage (Wechsel der Körperlage während des Schwimmens auf der Schwimmbahn ohne Festhalten)',
          'einmal ca. 2 m Tieftauchen von der Wasseroberfläche und einen Tauchring heraufholen',
          'ein Paketsprung vom Startblock oder 1 m- Brett',
          'Baderegeln'
        ],
        about: 'Dieser ist ein Kurs für diejenigen, die bereits schwimmen können und das Seepferdchen Schwimmabzeichen besitzen. Jedes Kind muss sich ohne Hilfsmittel über Wasser halten können. Im Bronzekurs werden die Kinder ihre bereits erlernten Fähigkeiten verbessern und Kondition aufbauen, vor allem das Brustschwimmen wird gefestigt. Erst mit dem Erwerb des DSA Bronze gilt ihr Kind als sichere/r Schwimmer/in.',
        subTitle: 'Anforderungen zum Schwimmabzeichen Bronze'
      },
      {
        rules: [
          'Sprung Kopfwärts vom Beckenrand und 20 Minuten Schwimmen. In dieser Zeit sind mindestens 400 m zurückzulegen, davon 300 m in Bauch- oder Rückenlage in einer erkennbaren Schwimmart und 100 m in der anderen Körperlage (Wechsel der Körperlage während des Schwimmens auf der Schwimmbahn ohne Festhalten)',
          'zweimal ca. 2 m Tieftauchen von der Wasseroberfläche mit Heraufholen je eines Gegenstandes (z.B kleiner Tauchring)',
          '10 m Streckentauchen mit Abstoßen vom Beckenrand im Wasser.',
          'Sprung aus 3 m Höhe oder zwei verschiedene Sprünge aus 1 m Höhe'
        ],
        about: 'Bei den Silber-und Goldkurse, wird das Gelerntes nochmal vertieft. Der Kurs ist anspruchsvoller, d.h. hier werden z.B. Rückenschwimmen und Kraulen erlernt und geübt, sowie Streckentauchen. Schwimmsicherheit, Ausdauer und Muskelkraft werden weiter ausgebaut. In unseren Silber- und Goldkurse dürfen Kinder ab 9 Jahren teilnehmen.',
        subTitle: 'Anforderungen zum Silber'
      },
      {
        rules: [
          'Sprung Kopfwärts vom Beckenrand und 30 Minuten Schwimmen. In dieser Zeit sind mindestens 800 m zurückzulegen, davon 650 m in den Bauch- oder Rückenlage in einer erkennbaren Schwimmart und 150 m in der anderen Körperlage (Wechsel der Körperlage während des Schwimmens auf der Schwimmbahn ohne Festhalten)',
          'Startsprung und 25 m Kraulschwimmen',
          'Startsprung und 50 m Brustschwimmen in höchstens 1:15 Minuten',
          '50 m Rückenschwimmen mit Grätschschwung ohne Armtätigkeit oder Rückenkraulschwimmen',
          '10 m streckentauchen aus der Schwimmlage (ohne Abstoßen vom Beckenrand)',
          'Dreimal ca. 2m Tieftauchen von der Wasseroberfläche mit Heraufholen je eines Gegenstandes (z.B.: kleiner Tauchring) innerhalb von 3 Minuten',
          'ein Sprung aus 3 m Höhe oder zwei verschiedene Sprünge aus 1 m Höhe',
          '50 m Transport schwimmen: Schieben oder Ziehen'
        ],
        about: 'Der Goldkurs ist der anspruchsvollste Kurs und erfordert bereits sehr gute Schwimmfähigkeiten. Hier werden alle Schwimmtechniken perfektioniert und die Ausdauer weiter trainiert.',
        subTitle: 'Anforderungen zum Goldkurse'
      }
    ]
  },
  {
    id: 3,
    number: '03',
    title: 'Jahreskurs',
    age: 'Alle Altersgruppen',
    level: 'beginner',
    badge: 'seepferdchen',
    image: img1,
    duration: '45 Minuten',
    lessons: 'Monatlich',
    kids: 'von 8-12 Kinder',
    price: '€40/Monat',
    location: 'Bad Sassendorf',
    startDate: 'Einsteigen jeder Zeit möglich',
    endDate: '',
    day: 'Sonntag',
    times: ['18:30 - 19:15'],
    description: [
      {
        rules: [],
        about: 'Unser Jahreskurs bietet kontinuierliches Schwimmtraining das ganze Jahr über. Sie können jederzeit einsteigen und monatlich bezahlen. Perfekt für regelmäßiges Training und kontinuierliche Verbesserung der Schwimmfähigkeiten.',
        subTitle: 'Jahreskurs - Kontinuierliches Training'
      }
    ]
  },
  {
    id: 4,
    number: '04',
    title: 'AquaFitnesskurs',
    age: 'Erwachsene',
    level: 'beginner',
    badge: 'seepferdchen',
    image: img3,
    duration: '45 Minuten',
    lessons: '10 Trainingseinheiten',
    kids: 'Erwachsene',
    price: '€120',
    location: 'Rüthen',
    startDate: '12. Januar 2026',
    endDate: '23. März 2026',
    day: 'Montag',
    times: ['18:00 - 18:45'],
    description: [
      {
        rules: [],
        about: 'Aqua-Fitness ist eine schonende, aber effektive Trainingsmethode im Wasser. Perfekt für alle, die ihre Fitness verbessern möchten, ohne die Gelenke zu belasten. Ideal für alle Altersgruppen und Fitnesslevel.',
        subTitle: 'AquaFitness für alle'
      }
    ]
  },
  {
    id: 5,
    number: '05',
    title: 'AquaFitnesskurs',
    age: 'Erwachsene',
    level: 'beginner',
    badge: 'seepferdchen',
    image: img3,
    duration: '45 Minuten',
    lessons: '10 Trainingseinheiten',
    kids: 'Erwachsene',
    price: '€150',
    location: 'Möhnesee (Hallenbad Körbecke)',
    startDate: '25. November 2025',
    endDate: '24. Februar 2026',
    day: 'Dienstag',
    times: ['18:00 - 18:45'],
    description: [
      {
        rules: [],
        about: 'Aqua-Fitness ist eine schonende, aber effektive Trainingsmethode im Wasser. Perfekt für alle, die ihre Fitness verbessern möchten, ohne die Gelenke zu belasten. Ideal für alle Altersgruppen und Fitnesslevel.',
        subTitle: 'AquaFitness für alle'
      }
    ]
  }
]