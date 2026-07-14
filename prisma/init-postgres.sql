-- CreateTable
CREATE TABLE "reservas" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT NOT NULL,
    "servicio" TEXT NOT NULL,
    "servicioNombre" TEXT NOT NULL,
    "conHostingWeb" BOOLEAN NOT NULL DEFAULT false,
    "precio" DECIMAL(10,2),
    "fechaVisita" TIMESTAMP(3),
    "horaVisita" TEXT,
    "estadoPago" TEXT NOT NULL DEFAULT 'pendiente',
    "metodoPago" TEXT,
    "stripeId" TEXT,
    "paypalId" TEXT,
    "estadoTour" TEXT NOT NULL DEFAULT 'pendiente',
    "notas" TEXT,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactos" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "empresa" TEXT,
    "posicion" TEXT,
    "mensaje" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'contacto',

    CONSTRAINT "contactos_pkey" PRIMARY KEY ("id")
);

