export type Patient = {
     id: string;
     first_name: string;
     last_name: string;
     date_of_birth: string;
     gender: 'male' | 'female' | 'other';
     address: string;
     contact_number: string;
     medical_history: string;
     current_diagnosis: string;
     treatment_plan: string;
     status: 'pending' | 'active' | 'completed';
     hospital_id: string;
     created_at: string;
};

export type Hospital = {
     id: string;
     name: string;
     address: string;
     contact_number: string;
     email: string;
     license_number: string;
     facilities: string[];
     operating_hours: string;
     verified: boolean;
     total_patients: number;
     placed_patients: number;
     pending_requests: number;
};

export type NGO = {
     id: string;
     name: string;
     address: string;
     contact_number: string;
     email: string;
     license_number: string;
     total_capacity: number;
     current_capacity: number;
     service_areas: string[];
     verified: boolean;
     total_patients_housed: number;
     upcoming_intakes: number;
};

// Functions to get data using fetch API instead of direct file access
export async function getPatients(): Promise<Patient[]> {
     try {
          const response = await fetch('/api/data?type=patients', { cache: 'no-store' });
          if (!response.ok) throw new Error('Failed to fetch patients');
          return await response.json();
     } catch (error) {
          console.error("Error fetching patients data:", error);
          return [];
     }
}

export async function getHospitals(): Promise<Hospital[]> {
     try {
          const response = await fetch('/api/data?type=hospitals', { cache: 'no-store' });
          if (!response.ok) throw new Error('Failed to fetch hospitals');
          return await response.json();
     } catch (error) {
          console.error("Error fetching hospitals data:", error);
          return [];
     }
}

export async function getNGOs(): Promise<NGO[]> {
     try {
          const response = await fetch('/api/data?type=ngos', { cache: 'no-store' });
          if (!response.ok) throw new Error('Failed to fetch NGOs');
          return await response.json();
     } catch (error) {
          console.error("Error fetching NGOs data:", error);
          return [];
     }
}

export async function getPatientsByHospitalId(hospitalId: string): Promise<Patient[]> {
     try {
          const response = await fetch(`/api/data?type=patients&hospitalId=${hospitalId}`, { cache: 'no-store' });
          if (!response.ok) throw new Error('Failed to fetch patients by hospital');
          return await response.json();
     } catch (error) {
          console.error("Error fetching patients by hospital:", error);
          return [];
     }
}

export async function getPendingPatients(): Promise<Patient[]> {
     try {
          const response = await fetch('/api/data?type=patients&status=pending', { cache: 'no-store' });
          if (!response.ok) throw new Error('Failed to fetch pending patients');
          return await response.json();
     } catch (error) {
          console.error("Error fetching pending patients:", error);
          return [];
     }
}

export async function getHospitalById(id: string): Promise<Hospital | null> {
     try {
          const response = await fetch(`/api/data?type=hospitals&id=${id}`, { cache: 'no-store' });
          if (!response.ok) throw new Error('Failed to fetch hospital by ID');
          return await response.json();
     } catch (error) {
          console.error("Error fetching hospital by ID:", error);
          return null;
     }
}

export async function getNGOById(id: string): Promise<NGO | null> {
     try {
          const response = await fetch(`/api/data?type=ngos&id=${id}`, { cache: 'no-store' });
          if (!response.ok) throw new Error('Failed to fetch NGO by ID');
          return await response.json();
     } catch (error) {
          console.error("Error fetching NGO by ID:", error);
          return null;
     }
}
