interface LetterCard {
  print: string
  cursive: string
  name: string
  englishName: string
}

const letters: LetterCard[] = [
  {
    print: 'א',
    cursive: 'א',
    name: 'אלף',
    englishName: 'Aleph'
  },
  {
    print: 'ב',
    cursive: 'ב',
    name: 'בית',
    englishName: 'Bet'
  },
  {
    print: 'ג',
    cursive: 'ג',
    name: 'גימל',
    englishName: 'Gimel'
  },
  {
    print: 'ד',
    cursive: 'ד',
    name: 'דלת',
    englishName: 'Dalet'
  }
]

export default function AlephBetGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
      {letters.map((letter, index) => (
        <div
          key={index}
          className="group relative aspect-square cursor-pointer"
        >
          {/* Glassmorphism Card */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
              {/* Print Version (Default) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                <span className="text-8xl md:text-9xl font-bold text-gray-800 font-hebrew">
                  {letter.print}
                </span>
                <span className="mt-4 text-lg font-semibold text-gray-700">
                  {letter.name}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  {letter.englishName}
                </span>
              </div>
              
              {/* Cursive Version (On Hover) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-8xl md:text-9xl font-bold text-indigo-600 font-hebrew">
                  {letter.cursive}
                </span>
                <span className="mt-4 text-lg font-semibold text-indigo-700">
                  {letter.name}
                </span>
                <span className="text-sm text-indigo-500 mt-1">
                  Cursive
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
