---
title: Introdução
description: shadcn/ui é um conjunto de components acessíveis e com design elegante, além de uma plataforma de distribuição de código. Funciona com seus frameworks e modelos de IA favoritos. Open Source. Open Code.
---

**Isso não é uma biblioteca de components. É como você constrói sua biblioteca de components.**

Você sabe como a maioria das bibliotecas de components tradicionais funciona: você instala um pacote do NPM, importa os components e os usa na sua aplicação.

Essa abordagem funciona bem até que você precise personalizar um component para se adequar ao seu design system ou precise de um que não está incluído na biblioteca. **Muitas vezes, você acaba encapsulando components da biblioteca, escrevendo soluções alternativas para sobrescrever estilos ou misturando components de diferentes bibliotecas com APIs incompatíveis.**

Isso é o que o shadcn/ui visa resolver. Ele é construído em torno dos seguintes princípios:

- **Open Code:** A camada superior do código dos seus components é aberta para modificação.
- **Composição:** Cada component usa uma interface comum e composável, tornando-os previsíveis.
- **Distribuição:** Um schema de arquivo plano e uma ferramenta de linha de comando facilitam a distribuição de components.
- **Padrões Elegantes:** Estilos padrão cuidadosamente escolhidos, para que você tenha um ótimo design pronto para uso.
- **Pronto para IA:** Código aberto para LLMs lerem, entenderem e melhorarem.

## Open Code

O shadcn/ui entrega o código real do component para você. Você tem controle total para personalizar e estender os components conforme suas necessidades. Isso significa:

- **Transparência Total:** Você vê exatamente como cada component é construído.
- **Personalização Fácil:** Modifique qualquer parte de um component para atender aos seus requisitos de design e funcionalidade.
- **Integração com IA:** O acesso ao código torna simples para LLMs lerem, entenderem e até melhorarem seus components.

_Em uma biblioteca típica, se você precisa alterar o comportamento de um botão, você precisa sobrescrever estilos ou encapsular o component. Com o shadcn/ui, você simplesmente edita o código do botão diretamente._

<Accordion collapsible>
  <AccordionItem value="faq-1" className="border-none">
    <AccordionTrigger>
      Como eu obtenho atualizações upstream em uma abordagem Open Code?
    </AccordionTrigger>
    <AccordionContent>
      <p>
        O shadcn/ui segue uma arquitetura de component headless. Isso significa que o
        núcleo da sua aplicação pode receber correções atualizando suas dependências, por
        exemplo, radix-ui ou input-otp.
      </p>
      <p className="mt-4">
        A camada mais externa, ou seja, a mais próxima do seu design system, não é
        acoplada à implementação da biblioteca. Ela permanece aberta para
        modificação.
      </p>
    </AccordionContent>
  </AccordionItem>
</Accordion>

## Composição

Cada component no shadcn/ui compartilha uma interface comum e composável. **Se um component não existe, nós o incorporamos, tornamos composável e ajustamos seu estilo para combinar e funcionar com o restante do design system.**

_Uma interface compartilhada e composável significa que é previsível tanto para sua equipe quanto para LLMs. Você não está aprendendo APIs diferentes para cada novo component. Mesmo para os de terceiros._

## Distribuição

O shadcn/ui também é um sistema de distribuição de código. Ele define um schema para components e uma CLI para distribuí-los.

- **Schema:** Uma estrutura de arquivo plana que define os components, suas dependências e propriedades.
- **CLI:** Uma ferramenta de linha de comando para distribuir e instalar components entre projetos com suporte cross-framework.

_Você pode usar o schema para distribuir seus components para outros projetos ou fazer a IA gerar components completamente novos baseados no schema existente._

## Padrões Elegantes

O shadcn/ui vem com uma grande coleção de components que possuem estilos padrão cuidadosamente escolhidos. Eles são projetados para ficarem bonitos por conta própria e para funcionarem bem juntos como um sistema consistente:

- **Ótimo Pronto para Uso:** Sua UI tem uma aparência limpa e minimalista sem trabalho extra.
- **Design Unificado:** Os components se encaixam naturalmente uns com os outros. Cada component é construído para combinar com os demais, mantendo sua UI consistente.
- **Facilmente Personalizável:** Se você quer mudar algo, é simples sobrescrever e estender os padrões.

## Pronto para IA

O design do shadcn/ui facilita o trabalho de ferramentas de IA com seu código. Seu código aberto e API consistente permitem que modelos de IA leiam, entendam e até gerem novos components.

_Um modelo de IA pode aprender como seus components funcionam e sugerir melhorias ou até criar novos components que se integram ao seu design existente._
