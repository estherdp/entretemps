// src/domain/repositories/index.ts

/**
 * Exporta todas las interfaces de repositorios del dominio.
 *
 * Estas interfaces definen los contratos para persistencia
 * sin acoplar el dominio a implementaciones concretas.
 */

export type { IAdventurePackRepository } from './adventure-pack-repository.interface'
export type { IImageCacheRepository } from './image-cache-repository.interface'
