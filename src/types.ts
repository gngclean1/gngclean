export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  detailedDescription: string;
  features: string[];
  basePrice: string;
  iconName: string;
}

export interface AIDiagnosisResult {
  diagnosis: string;
  reassurance: string;
  steps: string[];
}

export interface EstimationItem {
  id: string;
  name: string;
  basePrice: number;
  isSelected: boolean;
  category: string;
}
