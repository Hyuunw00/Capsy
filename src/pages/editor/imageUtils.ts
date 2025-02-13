// Base64 문자열 크기 검증 함수
export const validateBase64Size = (base64String: string): { isValid: boolean; error?: string } => {
  const sizeInBytes = base64String.length * 0.75;
  const sizeInMB = sizeInBytes / (1024 * 1024);

  if (base64String.includes('video')) {
    if (sizeInMB > 4000) {
      return { 
        isValid: false, 
        error: "비디오 크기가 4GB를 초과합니다." 
      };
    }
  } else {
    if (sizeInMB > 10) {
      return { 
        isValid: false, 
        error: "이미지 크기가 10MB를 초과합니다." 
      };
    }
  }

  return { isValid: true };
};

// 이미지 압축 함수
export const compressImage = (file: File, maxWidth = 1024): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };
      
      img.onerror = (error) => {
        reject(error);
      };
    };
  });
};

// 파일을 Base64로 변환하는 함수
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};