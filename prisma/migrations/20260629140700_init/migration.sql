-- CreateTable
CREATE TABLE `reservas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nombre` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `servicio` VARCHAR(191) NOT NULL,
    `servicioNombre` VARCHAR(191) NOT NULL,
    `conHostingWeb` BOOLEAN NOT NULL DEFAULT false,
    `precio` DECIMAL(10, 2) NULL,
    `fechaVisita` DATETIME(3) NULL,
    `horaVisita` VARCHAR(191) NULL,
    `estadoPago` VARCHAR(191) NOT NULL DEFAULT 'pendiente',
    `metodoPago` VARCHAR(191) NULL,
    `stripeId` VARCHAR(191) NULL,
    `paypalId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contactos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NULL,
    `empresa` VARCHAR(191) NULL,
    `posicion` VARCHAR(191) NULL,
    `mensaje` TEXT NOT NULL,
    `tipo` VARCHAR(191) NOT NULL DEFAULT 'contacto',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
