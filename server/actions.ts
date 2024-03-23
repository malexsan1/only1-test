import { QueryFunction } from "@tanstack/react-query";

import { Character } from "@/types";

const FAKE_DELAY = 1200;

const generateRandomCharacters = (): Character[] => {
  const data: Character[] = [];
  const names = [
    "Paul Atreides",
    "Lady Jessica",
    "Duncan Idaho",
    "Thufir Hawat",
    "Gurney Halleck",
    "Dr. Yueh",
    "Baron Harkonnen",
    "Piter De Vries",
    "Alia Atreides",
    "Stilgar",
    "Chani",
    "Emperor Shaddam IV",
    "Princess Irulan",
    "Feyd-Rautha",
    "Rabban",
    "Liet-Kynes",
    "Reverend Mother Gaius Helen Mohiam",
    "Jamis",
    "Harah",
    "Mapes",
  ];

  const house = ["Atreides", "Harkonnen", "Corrino"] as const;

  for (let i = 0; i < 20; i++) {
    const randomHouse = house[Math.floor(Math.random() * house.length)];

    data.push({
      name: names[i],
      house: randomHouse,
    });
  }

  return data;
};

const data = generateRandomCharacters();

export const getExampleData: QueryFunction<Character[]> = async ({
  queryKey,
}) => {
  const searchValue = (queryKey[1] as string) ?? "";

  return new Promise((resolve) => {
    const filteredData = data.filter((entry) =>
      entry.house.toLowerCase().includes(searchValue.toLowerCase())
    );

    setTimeout(() => {
      resolve(filteredData);
    }, FAKE_DELAY);
  });
};
