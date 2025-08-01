
---

In C++ there is a way to initialize array of variables in a `for loop`.

```cpp
static void adjustHumanAndMonster(int choice, int HumanEntry) {
  unsigned short int x = 0U;
  int arr[] = { std::rand() % 20 + 10,
    std::rand() % (choice == 1 || choice == 2) ? 10 + 10 : 20 + 10,
    std::rand() % (choice == 2) ? 15 : 5
  };
  static std::reference_wrapper<int> HumanVars[] = { atk, def, agi };
  static std::reference_wrapper<int> MonsterVars[] = { monsterAtk, monsterDef, monsterAgi };

  if (HumanEntry == 1) { for (auto &z : HumanVars) { z.get() = arr[x++]; } return; }
  for (auto &z : MonsterVars) { z.get() = arr[x++]; }
}
```