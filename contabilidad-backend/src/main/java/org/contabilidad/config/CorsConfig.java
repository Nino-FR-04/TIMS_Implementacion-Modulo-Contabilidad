package org.contabilidad.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Clase de configuración encargada de definir
 * las políticas CORS de la aplicación.
 *
 * Permite establecer los orígenes autorizados,
 * métodos HTTP permitidos y encabezados expuestos
 * para la comunicación entre el frontend y backend.
 *
 * En este caso se habilita el acceso desde
 * el frontend.
 */
@Configuration
public class CorsConfig {

    /**
     * Configura las reglas CORS para las rutas
     * de la API del sistema.
     *
     * @return configuración personalizada de CORS
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            /**
             * Agrega configuraciones CORS al registro.
             *
             * @param registry registro utilizado para
             * definir las políticas CORS
             */
            @Override
            public void addCorsMappings(@NotNull CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
                        .exposedHeaders("*");
            }
        };
    }
}
