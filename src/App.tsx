import {
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import history from "./assets/history.json";

enum Grade {
  "SS" = 10,
  "MS" = 7,
  "MM" = 5,
  "MI" = 4,
  "II" = 2,
  "SR" = 0,
  "TR" = -1,
}

type Subject = {
  nome: string;
  professor: string;
  menção: string;
  créditos: number;
  código: string;
  departamento: string;
};

type Semester = {
  materias: {
    fluxo: Subject[];
    optativas: Subject[];
    modulo_livre: Subject[];
    pendentes: Subject[];
  };
  total_creditos_fluxo: number;
  total_creditos_adquiridos: number;
  IRA: number;
};

type History = {
  CiC: {
    semestres: Semester[];
  };
};

const typedHistory: History = history;

const mapGradeToColor = (grade: string) => {
  const castedGrade = Grade[grade as keyof typeof Grade];
  switch (castedGrade) {
    case Grade.SS:
      return "green.400";
    case Grade.MS:
      return "green.200";
    case Grade.MM:
      return "yellow.400";
    case Grade.MI:
      return "red.100";
    case Grade.II:
      return "red.300";
    case Grade.SR:
      return "red.500";
    case Grade.TR:
      return "gray.500";
  }
};

export function App() {
  function calculatePeriod(index: number) {
    const period = (index % 2) + 1;
    const year = Math.floor(index / 2) + 2017;
    return `${year}/${period}`;
  }

  function percentDiff(
    currentSemester: Semester,
    previousSemester: Semester,
    property: keyof Pick<Semester, "total_creditos_adquiridos" | "IRA">
  ) {
    if (!previousSemester) return;
    const div = currentSemester[property] / previousSemester[property];
    const p = (div > 1 ? 1 : -1) * (div - 1) * 100;
    return `${div > 1 ? "+" : "-"}${p.toFixed(1)}%`;
  }

  function renderSubject(subject: Subject, index: number) {
    return (
      <VStack
        key={index}
        p="4"
        rounded="lg"
        minW={["xs", "lg"]}
        position="relative"
        borderWidth="thin"
        shadow="lg"
      >
        <Text fontWeight="bold" maxW="md" textAlign="center">
          {subject.nome} ({subject.departamento}
          {subject.código && ` - ${subject.código}`})
        </Text>
        <Text maxW="xs" textAlign="center">
          {subject.professor.replace("; ", " e ")}
        </Text>
        <Flex
          align="center"
          justify="center"
          position="absolute"
          top="-5"
          right="-5"
          bg={mapGradeToColor(subject.menção)}
          rounded="full"
          p="2"
          h={["10", "12"]}
          w={["10", "12"]}
          fontWeight="bold"
        >
          {subject.menção}
        </Flex>
      </VStack>
    );
  }

  function renderSemester(
    semester: Semester,
    index: number,
    semesters: Semester[]
  ) {
    const previousSemester = semesters?.[index - 1];
    const pDiffIra = percentDiff(semester, previousSemester, "IRA");
    const pDiffCredits = percentDiff(
      semester,
      previousSemester,
      "total_creditos_adquiridos"
    );

    return (
      <GridItem
        key={index}
        borderWidth={["", "thin"]}
        shadow={["", "lg"]}
        rounded="lg"
        p="5"
      >
        <Flex direction="column" align="center">
          <Heading textDecor="underline" pb={["2", "1"]}>
            {calculatePeriod(index)}
          </Heading>
          <Flex direction="column" alignSelf="start" w="full">
            <Flex
              direction="row"
              align="center"
              w="40"
              justify="space-between"
              p="1"
            >
              <Text>Créditos: {semester.total_creditos_adquiridos}</Text>
              {previousSemester && (
                <Text
                  p="1"
                  rounded="lg"
                  bg={pDiffCredits![0] === "+" ? "green.100" : "red.100"}
                >
                  {pDiffCredits}
                </Text>
              )}
            </Flex>
            <Flex
              direction="row"
              align="center"
              w="40"
              justify="space-between"
              p="1"
            >
              <Text>IRA: {semester.IRA.toPrecision(5)}</Text>
              {previousSemester && (
                <Text
                  p="1"
                  rounded="lg"
                  bg={pDiffIra![0] === "+" ? "green.100" : "red.100"}
                >
                  {pDiffIra}
                </Text>
              )}
            </Flex>
          </Flex>
          <VStack gap="5">
            {Object.entries(semester.materias).map(
              ([title, type]) =>
                type.length > 0 && (
                  <VStack key={title} gap="3">
                    <Heading size="lg" textTransform="capitalize">
                      {title.replace("_", " ")}
                    </Heading>
                    {type.map(renderSubject)}
                  </VStack>
                )
            )}
          </VStack>
        </Flex>
      </GridItem>
    );
  }

  return (
    <SimpleGrid columns={[1, 1, 1, 2]} spacing={["2", "10"]} p={["3", "5"]}>
      {typedHistory.CiC.semestres.map(renderSemester)}
    </SimpleGrid>
  );
}
