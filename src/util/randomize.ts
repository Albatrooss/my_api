import { MEMBERS } from "./constants"
import { Robillard } from "./types";

interface Results {
  tim?: Robillard;
  caitlin?: Robillard;
  andrew?: Robillard;
  kyla?: Robillard;
  adam?: Robillard;
  hannah?: Robillard;
  hugh?: Robillard;
  patti?: Robillard;
}

export const randomize = (timesFailed=0): Results => {
  if (timesFailed > 100) throw new Error('Failed too many times..');

  const results: Results = {
  };
  const taken: Robillard[] = [];
  let failed = false;

  for (const person in MEMBERS) {
      let partner = MEMBERS[person as Robillard];
      const possibilites = Object.values(MEMBERS).filter(x => x !== person && x !== partner && !taken.includes(x))
      if (possibilites.length < 1) {
          failed = true;
          break
      }
      let res = possibilites[Math.floor(Math.random() * possibilites.length)];
      results[person as Robillard] = res
      taken.push(res)
  }
  if (failed) {
      timesFailed++
      return randomize(timesFailed);
  }
  return results;
}