import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Hospital, NGO, Patient } from '@/lib/database';

function readJsonFile<T>(filePath: string): T {
     const fullPath = path.join(process.cwd(), filePath);
     const fileContents = fs.readFileSync(fullPath, 'utf8');
     return JSON.parse(fileContents) as T;
}

export async function GET(request: Request) {
     // Get the type of data from the query parameter
     const { searchParams } = new URL(request.url);
     const type = searchParams.get('type');
     const id = searchParams.get('id');
     const status = searchParams.get('status');
     const hospitalId = searchParams.get('hospitalId');

     try {
          if (type === 'patients') {
               const patients = readJsonFile<Patient[]>('database/patients.json');

               // Apply filters if provided
               let filteredPatients = patients;
               if (hospitalId) {
                    filteredPatients = patients.filter(p => p.hospital_id === hospitalId);
               }
               if (status) {
                    filteredPatients = filteredPatients.filter(p => p.status === status);
               }

               return NextResponse.json(filteredPatients);
          }
          else if (type === 'hospitals') {
               const hospitals = readJsonFile<Hospital[]>('database/hospitals.json');

               // Return specific hospital if ID is provided
               if (id) {
                    const hospital = hospitals.find(h => h.id === id);
                    return NextResponse.json(hospital || null);
               }

               return NextResponse.json(hospitals);
          }
          else if (type === 'ngos') {
               const ngos = readJsonFile<NGO[]>('database/ngos.json');

               // Return specific NGO if ID is provided
               if (id) {
                    const ngo = ngos.find(n => n.id === id);
                    return NextResponse.json(ngo || null);
               }

               return NextResponse.json(ngos);
          }
          else {
               return NextResponse.json({ error: 'Invalid data type requested' }, { status: 400 });
          }
     } catch (error) {
          console.error('Error reading data:', error);
          return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
     }
}
