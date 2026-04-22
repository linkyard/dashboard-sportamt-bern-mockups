export type ContactAddress = {
  organisationName: string;
  contactPerson: string;
  street: string;
  city: string;
  email: string;
  phone: string;
};

export type Organisation = {
  id: string;
  organisation: string;
  contact: ContactAddress;
  billingContact?: ContactAddress;
  anlaesse: { name: string; date: string }[];
};
