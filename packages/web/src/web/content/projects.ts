export interface MusicProject {
  title: string;
  description: string;
  roles: string[];
  image: string;
  spotify?: string;
  youtube?: string;
  /** External public link (e.g. studio session, unreleased preview). */
  link?: string;
  /** Optional custom label for the external link button. */
  linkLabel?: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  image: string;
}

export const musicProjects: MusicProject[] = [
  {
    title: "Perdóname Hermano",
    description:
      "Written, Produced, Recorded & Mixed by me. Met many incredible people during the process that helped me.",
    roles: ["Artista", "Producer", "Recording Engineer", "Mixing Engineer", "Compositor"],
    image: "/images/projects/perdoname-hermano.jpg",
    spotify: "6dw04fT3QQrVVtTPzkeBXC",
    youtube: "4MM2SRy6Joo",
  },
  {
    title: "La Voz de las Nubes",
    description:
      "This was the first time I've ever fully produced, recorded and mixed a whole song of mine.",
    roles: ["Artista", "Producer", "Mixing Engineer", "Recording Engineer"],
    image: "/images/projects/la-voz-de-las-nubes.jpg",
    spotify: "0EnAJhYODTNBudub9GB7m5",
    youtube: "iyY41haaiHE",
  },
  {
    title: "BAD BITCH — Song for Bruno Mars",
    description:
      "I wrote and produced a song specifically for Bruno Mars to use and release — now in process to getting recorded in the studio professionally.",
    roles: ["Compositor", "Producer", "Recording Engineer"],
    image: "/images/projects/bad-bitch-bruno-mars.jpg",
  },
  {
    title: "A Través del Cristal — Manu Llovo",
    description:
      "Recording Engineer for the main instruments for the song like Acoustic guitars, drums, vocals and mixing.",
    roles: ["Recording Engineer"],
    image: "/images/projects/a-traves-del-cristal.jpg",
    spotify: "6zqTFdvLoNi76GCD84VOsM",
    youtube: "gzo-VZtAObU",
  },
  {
    title: "Todo Ha Cambiado — Javi Chapela",
    description:
      "Recording Engineer of all the Acoustic Guitars, Drums and Vocals.",
    roles: ["Recording Engineer"],
    image: "/images/projects/todo-ha-cambiado.jpg",
    spotify: "3PXtc85g1MWi34jgMx5qyZ",
    youtube: "ex4BXKwdP2U",
  },
  {
    title: "Do You Miss Me — Diogo Oliveira",
    description: "Musical/executive producer, recording & mixing engineer.",
    roles: ["Producer", "Recording Engineer", "Mixing Engineer"],
    image: "/images/projects/do-you-miss-me.jpg",
    spotify: "15PkOIVhwFfRvWH84fE899",
  },
  {
    title: "Aislado",
    description:
      "Songwriter, producer and editor of the song. Involved in all the technical stages of the song.",
    roles: ["Artista", "Producer", "Recording Engineer"],
    image: "/images/projects/aislado.jpg",
    spotify: "7uA5K87CHdkPZ1WwuACZYV",
    youtube: "c6tdHGfmI3I",
  },
  {
    title: "Auténtica Pareja",
    description:
      "Songwriter, producer, recording and mixing engineer of the song.",
    roles: ["Mixing Engineer", "Producer", "Artista", "Compositor"],
    image: "/images/projects/autentica-pareja.jpg",
    spotify: "5QY3j1l6XdKIRU8MGGRtHN",
    youtube: "sy4jUJY0xqY",
  },
  {
    title: "Diogo Oliveira",
    description:
      "Found a very special young talent that I'm working on turning into the biggest pop star of this generation. Has the voice of Shawn Mendes, the capability of writing songs like Ed Sheeran and the funky pop goodness of the greats.",
    roles: ["Executive Producer", "Digital Strategist", "Producer", "Recording Engineer"],
    image: "/images/projects/diogo-oliveira.jpg",
  },
  {
    title: "Ukuledu",
    description:
      "The executive producer for an EP based in 4 different songs. Involved in all the stages.",
    roles: ["Executive Producer", "Mixing Engineer", "Compositor", "Recording Engineer"],
    image: "/images/projects/ukuledu.jpg",
  },
  {
    title: "wyacotta",
    description:
      "Executive producer to a young talent. Involved in all of the stages.",
    roles: ["Executive Producer", "Manager", "Mixing Engineer", "Recording Engineer"],
    image: "/images/projects/wyacotta.jpg",
    spotify: "50i0qrCEJqGYZy3OJfdAPN",
  },
];

export const projects: Project[] = [
  {
    title: "Music for Interstellar (Dolby Atmos)",
    description:
      "Class assignment to make an original composition for an AudioVisual media. Also mixed it in a certified Dolby Atmos studio with a classic 7.1.4 set up.",
    tags: ["Compositor", "Producer", "Recording and Mixing Engineer"],
    image: "/images/projects/interstellar.jpg",
  },
  {
    title: "Foley in Dolby 5.1.2",
    description:
      "Class assignment to pick a short scene from a movie, make up to 75% of all the foley sounds, double all the voices in Spanish, and mix the whole thing in a multi-surround speaker system of 5.1.2.",
    tags: ["Producer", "Foley", "Recording and Mixing Engineer"],
    image: "/images/projects/foley-dolby.jpg",
  },
  {
    title: "SAE Assembly",
    description:
      "Founder of SAE Assembly, an organization created inside of the SAE institution to connect all the students between all the modules and courses. It's a space where we can all get to know each other and a platform to promote everyone's projects and events.",
    tags: ["Meet&Greet", "MusicHub", "Networking"],
    image: "/images/projects/sae-assembly.jpg",
  },
  {
    title: "Baby Driver Trailer",
    description:
      "My first ever sonorization project for school back in Mallorca, made from real Foley recordings and Library packs.",
    tags: ["Mix Engineer", "Foley", "Producer"],
    image: "/images/projects/baby-driver.jpg",
  },
  {
    title: "Videogame Sonorization Wwise",
    description:
      "Had to sonorize the test game Cube with my own SFX and music.",
    tags: ["Wwise", "Pro Tools", "Foley"],
    image: "/images/projects/videogame-wwise.jpg",
  },
];
