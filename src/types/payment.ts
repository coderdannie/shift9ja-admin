export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type FeeType = 'FLAT' | 'PERCENTAGE';

export interface PaymentProvider {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  isEnabled: boolean;
  isDefault: boolean;
  priority: number;
  withdrawalFeeType: FeeType;
  withdrawalFeeAmount: string;
  withdrawalFeeCap: string;
  fundingFeeType: FeeType;
  fundingFeeAmount: string;
  fundingFeeCap: string;
}

export type PaymentProviderResponse = PaymentProvider[];
