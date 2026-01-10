
export function getGridClass(count: number) {
  switch (true) {
    case count === 1:
      return "grid-cols-1 grid-rows-1";

    case count === 2:
      return "grid-cols-2 grid-rows-1";

    case count <= 4:
      return "grid-cols-2 grid-rows-2";

    case count <= 6:
      return "grid-cols-3 grid-rows-2";

    case count <= 9:
      return "grid-cols-3 grid-rows-3";

    default:
      return "grid-cols-4 grid-rows-3";
  }
}

export async function getUserDevice() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    return stream;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const lsSetItem = (key: string, val: string) => {
  localStorage.setItem(key, val);
};

export const lsGetItem = (key: string) => {
  return localStorage.getItem(key);
};

export const isValidateSessionCode = (code: string): boolean => {
  const strictRegex = /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/;
  return strictRegex.test(code.trim());
};


